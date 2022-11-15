import * as React from "react";
import { Box } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import BookLists from "./BookLists";
import NextLoading from "../common/NextLoading";
import InitialLoading from "../common/InitialLoading";
import Error from "../common/Error";
import Header from "../header/Header";
import { fetchBooks } from "../../utils/fetchBooks";
import { parseHeaders } from "../../utils/parseHeaders";
import { fetchCharacters } from "../../utils/fetchCharacters";

const Books = () => {
  const url = "https://www.anapioficeandfire.com/api/books?page=1&pageSize=6";

  const [books, setBooks] = React.useState<BookTypes[]>([]);
  const [characters, setCharacters] = React.useState<CharacterTypes[]>([]);
  const [nextUrl, setNextUrl] = React.useState("");

  const [initialLoading, setInitialLoading] = React.useState(true);
  const [initialError, setInitialError] = React.useState(false);
  const [, setNextLoading] = React.useState(false);
  const [nextError, setNextError] = React.useState(false);

  React.useEffect(() => {
    const fetchInitBooks = async (url: string) => {
      setInitialError(false);

      try {
        const response = await fetchBooks(url);
        const books = await response.json();
        const headerLinks = parseHeaders(response);

        const characters = await fetchCharacters();

        setBooks(books);
        setCharacters(characters);
        setNextUrl(headerLinks.next);
      } catch (error) {
        setInitialError(true);
      }

      setInitialLoading(false);
    };

    if (initialLoading) fetchInitBooks(url);
  }, [initialLoading]);

  const fetchNextBooks = async (url: string) => {
    setNextLoading(true);
    setNextError(false);

    try {
      const response = await fetchBooks(url);
      const headerLinks = parseHeaders(response);
      const data = await response.json();

      setBooks(books.concat(data));
      setNextUrl(headerLinks.next);
    } catch (error) {
      setNextError(true);
    }

    setNextLoading(false);
  };

  const handleFetchNextBooks = () => {
    if (nextUrl) {
      fetchNextBooks(nextUrl);
    }
  };

  const handleInitialTryAgain = () => {
    setInitialLoading(true);
  };

  return (
    <Box my="8" marginX="auto" maxW="1300px" px="4">
      {initialLoading ? (
        <InitialLoading />
      ) : (
        <>
          {initialError ? (
            <Error
              onTryAgain={handleInitialTryAgain}
              text="Something went wrong trying to connect to the API endpoint. Please check your internet
              connection and try again."
            />
          ) : (
            <>
              <Header books={books} characters={characters} />
              <InfiniteScroll
                scrollThreshold={1}
                dataLength={books.length}
                next={handleFetchNextBooks}
                hasMore={nextUrl ? true : false}
                loader={!nextError && <NextLoading />}
              >
                <BookLists
                  books={books}
                  onTryAgain={handleFetchNextBooks}
                  nextError={nextError}
                />
              </InfiniteScroll>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default Books;
