import moment from "moment";

type searchHelperTypes = {
  books: BookTypes[];
  filter: BookKeys;
  searchQuery: string;
  characters: CharacterTypes[];
};

export const searchHelper = (paramsObj: searchHelperTypes) => {
  const { filter, books, searchQuery, characters } = paramsObj;

  if (filter === "released") {
    return books.filter((book) =>
      moment(moment(book["released"]).format("YYYY-MM-DD")).isSame(searchQuery)
    );
  }

  if (filter === "authors") {
    return books.filter((book) =>
      book.authors.some((author) =>
        author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  if (filter === "characters" || filter === "culture") {
    let key: CharacterKeys = "culture";
    if (filter === "characters") key = "name";

    const queryCharacters = characters.filter(
      (character) => character[key].toLowerCase() === searchQuery.toLowerCase()
    );

    return books.filter((book) =>
      queryCharacters.some((queryCharacter) =>
        queryCharacter.books.some((bookUrl) => bookUrl === book.url)
      )
    );
  }

  return books.filter((book) =>
    book[filter].toLowerCase().includes(searchQuery.toLowerCase())
  );
};
