import moment from "moment";

const getRandomArray = (array: string[], count: number) => {
  const [_head, ...arrayCopy] = array;
  return new Array(count).fill(0).map(() => {
    const index = Math.floor(Math.random() * arrayCopy.length);
    return arrayCopy.splice(index, 1)[0];
  });
};

const authors = ["Author 1", "Author 2", "Author 3"];
const publishers = ["Publisher 1", "Publisher 2", "Publisher 3", "Publisher 4"];
const mediaTypes = ["MediaType 1", "MediaType 2", "MediaType 3", "MediaType 4"];
const url = "https://www.anapioficeandfire.com/api/characters";
const characters = [`${url}/1`, `${url}/2`, `${url}/3`, `${url}/4`, `${url}/5`];

const makeBooks = (n?: number) => {
  const num = n || 12;
  const books = [];

  for (let i = 0; i < num; i++) {
    books.push({
      url: `https://www.anapioficeandfire.com/api/books/${i + 1}`,
      name: `Book ${i + 1}`,
      isbn: `${Math.floor(Math.random() * 100000000000000)}`,
      authors: [authors[Math.floor(Math.random() * authors.length)]],
      numberOfPages: Math.ceil(Math.random() * (800 - 200) + 200),
      publisher: publishers[Math.floor(Math.random() * publishers.length)],
      country: "United States",
      mediaType: mediaTypes[Math.floor(Math.random() * mediaTypes.length)],
      released: `${moment(
        moment("2021-11-02").add(-i, "years").toDate()
      ).format("YYYY-MM-DD")}`,
      characters: getRandomArray(characters, 4),
      povCharacters: getRandomArray(characters, 2),
    });
  }
  return books;
};

const books = makeBooks();

export const getBooks = (page?: number, pageSize?: number) => {
  if (!page || page <= 0) return books.slice(0, 10);

  const defaultPageSize = 10;
  let start = (page - 1) * defaultPageSize;
  let end = start + defaultPageSize;

  if (!pageSize || pageSize <= 0) return books.slice(start, end);

  start = (page - 1) * pageSize;
  end = start + pageSize;

  return books.slice(start, end);
};
