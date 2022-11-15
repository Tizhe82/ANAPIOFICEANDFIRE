import { rest } from "msw";
import { setupServer } from "msw/node";
import { getBooks } from "./makeBooks";
import { getCharacters } from "./makeCharacters";

const baseUrl = "https://www.anapioficeandfire.com/api";
const bookUrl = `${baseUrl}/books`;
const characterUrl = `${baseUrl}/characters`;

const server = setupServer(
  rest.get(bookUrl, (req, res, ctx) => res(ctx.json(getBooks()))),
  rest.get(characterUrl, (req, res, ctx) => res(ctx.json(getCharacters()))),

  rest.get("*", (req, res, ctx) => {
    console.error(`Please add a request handler for ${req.url.toString()}`);
    return res(
      ctx.status(500),
      ctx.json({ Error: "Please add a request handler" })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

export { server, rest };
