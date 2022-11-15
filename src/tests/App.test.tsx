import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import moment from "moment";
import { server, rest } from "./utils/testServer";
import { fetchBooks } from "../utils/fetchBooks";
import { fetchCharacters } from "../utils/fetchCharacters";
import { getBooks } from "./utils/makeBooks";
import { getCharacters } from "./utils/makeCharacters";
import { getNextCharactersLink } from "./utils/getNextCharactersLink";
import App from "../App";

const bookUrl = "https://www.anapioficeandfire.com/api/books";
const bookInitUrl = `${bookUrl}?page=1&pageSize=6`;

const bookInitHeaderLink = `<${bookUrl}?page=2&pageSize=6>; rel="next",
 <${bookUrl}?page=1&pageSize=6>; rel="first",
 <${bookUrl}?page=2&pageSize=6>; rel="last"`;

const characterUrl = "https://www.anapioficeandfire.com/api/characters";

describe("<App />", () => {
  let response: Response, books: BookTypes[], characters: CharacterTypes[];

  beforeEach(async () => {
    server.use(
      rest.get(bookUrl, (req, res, ctx) => {
        const page = Number(req.url.searchParams.get("page"));
        const pageSize = Number(req.url.searchParams.get("pageSize"));

        return res(
          ctx.json(getBooks(page, pageSize)),
          ctx.set("link", bookInitHeaderLink)
        );
      })
    );

    server.use(
      rest.get(characterUrl, (req, res, ctx) => {
        const page = Number(req.url.searchParams.get("page"));
        const pageSize = Number(req.url.searchParams.get("pageSize"));

        return res(
          ctx.json(getCharacters(page, pageSize)),
          ctx.set("link", getNextCharactersLink(page))
        );
      })
    );

    render(<App />);

    expect(screen.getByTestId("init-spinner")).toBeInTheDocument();

    await act(async () => {
      response = await fetchBooks(bookInitUrl);
      books = await response.json();
      characters = await fetchCharacters();
    });

    expect(screen.queryByTestId("init-spinner")).not.toBeInTheDocument();
  });

  describe("rendering the list of books available on Ice and Fire API", () => {
    it("should render the list of books having publisher, name, isbn, authors and end date", async () => {
      const renderedBooks = screen.getAllByTestId("book").map((book) => ({
        publisher: within(book).getByTestId("publisher").textContent,
        name: within(book).getByTestId("name").textContent,
        isbn: within(book).getByTestId("isbn").textContent,
        authors: within(book)
          .getAllByTestId("author")
          .map((authorName) => ({
            authorName: within(authorName).getByTestId("author-name")
              .textContent,
          })),
        released: within(book).getByTestId("released").textContent,
      }));
      expect(renderedBooks.length).toBe(books.length);
      renderedBooks.forEach((book, i) => {
        expect(book).toHaveProperty("publisher", books[i].publisher);
        expect(book).toHaveProperty("isbn", books[i].isbn);
        expect(book).toHaveProperty("name", books[i].name);
        expect(book.authors.length).toBe(books[i].authors.length);
        book.authors.forEach((author, index) =>
          expect(author.authorName).toBe(books[i].authors[index])
        );
        expect(book).toHaveProperty(
          "released",
          moment(books[i].released).format("L")
        );
      });
    });
  });

  describe("searching the list of books on the UI", () => {
    let searchField: HTMLElement,
      resultBox: HTMLElement,
      filterField: HTMLElement,
      searchQuery: string;

    beforeEach(async () => {
      searchField = screen.getByLabelText("Search books...");
      resultBox = screen.getByTestId("search-result");
      filterField = screen.getByRole("combobox");

      expect(resultBox).not.toBeVisible();
    });

    it("should search for books using name parameter", async () => {
      searchQuery = books[0].name;

      userEvent.type(searchField, searchQuery);
      expect(searchField).toHaveValue(searchQuery);

      expect(resultBox).toBeVisible();

      const text = within(resultBox).getByTestId("result-link").textContent;
      expect(text).toBe(searchQuery);
    });

    it("should search for books using publisher parameter", async () => {
      userEvent.selectOptions(filterField, "publisher");
      searchQuery = books[0].publisher;

      userEvent.type(searchField, searchQuery);
      expect(searchField).toHaveValue(searchQuery);

      expect(resultBox).toBeVisible();

      const matchBooks = books.filter((book) => book.publisher === searchQuery);

      const resultLinks = screen.getAllByTestId("result-link").map((link) => ({
        name: link.textContent,
      }));

      expect(matchBooks.length).toBe(resultLinks.length);
      matchBooks.forEach((book, i) =>
        expect(book.name).toBe(resultLinks[i].name)
      );
    });

    it("should search for books using isbn parameter", async () => {
      userEvent.selectOptions(filterField, "isbn");
      searchQuery = books[0].isbn;

      userEvent.type(searchField, searchQuery);
      expect(searchField).toHaveValue(searchQuery);

      expect(resultBox).toBeVisible();

      const text = within(resultBox).getByTestId("result-link").textContent;
      expect(text).toBe(books[0].name);
    });

    it("should search for books using end date parameter", async () => {
      userEvent.selectOptions(filterField, "released");

      searchQuery = moment(books[0].released).format("YYYY-MM-DD");

      userEvent.type(searchField, searchQuery);
      expect(searchField).toHaveValue(searchQuery);

      expect(resultBox).toBeVisible();

      const text = within(resultBox).getByTestId("result-link").textContent;
      expect(text).toBe(books[0].name);
    });

    it("should search for books using authors parameter", async () => {
      userEvent.selectOptions(filterField, "authors");
      searchQuery = books[0].authors[0];

      userEvent.type(searchField, searchQuery);
      expect(searchField).toHaveValue(searchQuery);

      expect(resultBox).toBeVisible();

      const matchBooks = books.filter((book) =>
        book.authors.some((author) => author === searchQuery)
      );

      const resultLinks = screen.getAllByTestId("result-link").map((link) => ({
        name: link.textContent,
      }));

      expect(matchBooks.length).toBe(resultLinks.length);
      matchBooks.forEach((book, i) =>
        expect(book.name).toBe(resultLinks[i].name)
      );
    });

    it("should search for books using characters name", async () => {
      userEvent.selectOptions(filterField, "characters");
      searchQuery = characters[0].name;

      userEvent.type(searchField, searchQuery);
      expect(searchField).toHaveValue(searchQuery);

      expect(resultBox).toBeVisible();

      const matchCharacters = characters.filter(
        (character) => character.name === searchQuery
      );

      const matchBooks = books.filter((book) =>
        matchCharacters.some((matchCharacter) =>
          matchCharacter.books.some((bookUrl) => bookUrl === book.url)
        )
      );

      const resultLinks = screen.getAllByTestId("result-link").map((link) => ({
        name: link.textContent,
      }));

      expect(matchBooks.length).toBe(resultLinks.length);
      matchBooks.forEach((book, i) =>
        expect(book.name).toBe(resultLinks[i].name)
      );
    });

    it("should search for books using characters culture", async () => {
      userEvent.selectOptions(filterField, "culture");
      searchQuery = characters[0].culture;

      userEvent.type(searchField, searchQuery);
      expect(searchField).toHaveValue(searchQuery);

      expect(resultBox).toBeVisible();

      const matchCharacters = characters.filter(
        (character) => character.culture === searchQuery
      );

      const matchBooks = books.filter((book) =>
        matchCharacters.some((matchCharacter) =>
          matchCharacter.books.some((bookUrl) => bookUrl === book.url)
        )
      );

      const resultLinks = screen.getAllByTestId("result-link").map((link) => ({
        name: link.textContent,
      }));

      expect(matchBooks.length).toBe(resultLinks.length);
      matchBooks.forEach((book, i) =>
        expect(book.name).toBe(resultLinks[i].name)
      );
    });
  });
});
