import { parseHeaders } from "./parseHeaders";

const url =
  "https://www.anapioficeandfire.com/api/characters?page=1&pageSize=50";

const doFetch = async (url: string) => {
  try {
    const response = await fetch(url);
    const characters = await response.json();

    const headerLinks = parseHeaders(response);
    const nextUrl = headerLinks.next;

    if (nextUrl) {
      const newCharacters = await doFetch(nextUrl);
      characters.push(...newCharacters);
    }

    return characters;
  } catch (error) {
    throw error;
  }
};

export const fetchCharacters = async () => {
  try {
    return await doFetch(url);
  } catch (error) {
    throw error;
  }
};
