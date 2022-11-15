type BookKeys = keyof BookSearchTypes;
type CharacterKeys = keyof CharactersSearchTypes;

type CharactersSearchTypes = {
  name: string;
  culture: string;
};

type BookSearchTypes = {
  publisher: string;
  name: string;
  isbn: string;
  released: string;
  authors: string[];
  characters: string;
  culture: string;
};

type BookTypes = {
  url: string;
  name: string;
  isbn: string;
  numberOfPages: number;
  authors: string[];
  publisher: string;
  country: string;
  mediaType: string;
  released: string;
  characters: string[];
  povCharacters: string[];
};

type CharacterTypes = {
  url: string;
  name: string;
  gender: string;
  culture: string;
  born: string;
  died: string;
  titles: string[];
  aliases: string[];
  father: string;
  mother: string;
  spouse: string;
  allegiances: string[];
  books: string[];
  povBooks: never[];
  tvSeries: string[];
  playedBy: string[];
};
