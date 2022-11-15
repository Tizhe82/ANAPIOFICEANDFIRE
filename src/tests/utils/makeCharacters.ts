function getRandomArray(array: string[], count: number) {
  const [_head, ...arrayCopy] = array;
  return new Array(count).fill(0).map(() => {
    const index = Math.floor(Math.random() * arrayCopy.length);
    return arrayCopy.splice(index, 1)[0];
  });
}

const cultures = ["Culture 1", "Culture 2", "Culture 3", "Culture 4"];

const url = "https://www.anapioficeandfire.com/api/books";
const books = [`${url}/1`, `${url}/2`, `${url}/3`, `${url}/4`, `${url}/5`];

const makeCharacters = (n?: number) => {
  const num = n || 2134;
  const characters = [];

  for (let i = 0; i < num; i++) {
    characters.push({
      url: `https://www.anapioficeandfire.com/api/characters/${i + 1}`,
      name: `Character ${i + 1}`,
      gender: ["Male", "Female"][Math.floor(Math.random() * 2)],
      culture: cultures[Math.floor(Math.random() * cultures.length)],
      born: "",
      died: "",
      titles: [""],
      aliases: [""],
      father: "",
      mother: "",
      spouse: "",
      allegiances: [],
      books: getRandomArray(books, 3),
      povBooks: [],
      tvSeries: [""],
      playedBy: [""],
    });
  }
  return characters;
};

const characters = makeCharacters();

export const getCharacters = (page?: number, pageSize?: number) => {
  if (!page || page <= 0) return characters.slice(0, 10);

  const defaultPageSize = 10;
  let start = (page - 1) * defaultPageSize;
  let end = start + defaultPageSize;

  if (!pageSize || pageSize <= 0) return characters.slice(start, end);

  start = (page - 1) * pageSize;
  end = start + pageSize;

  return characters.slice(start, end);
};
