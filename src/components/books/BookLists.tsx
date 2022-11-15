import { Box, Grid } from "@chakra-ui/react";
import BookLayout from "./BookLayout";
import Error from "../common/Error";

type BookListsProps = {
  books: BookTypes[];
  onTryAgain: () => void;
  nextError: boolean;
};

const BookLists = ({ books, onTryAgain, nextError }: BookListsProps) => {
  return (
    <Box>
      <Grid
        gridGap="6"
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
      >
        {books?.map((book) => (
          <BookLayout key={book.isbn} book={book} />
        ))}
      </Grid>

      {nextError && (
        <Error
          onTryAgain={onTryAgain}
          text="Something went wrong trying to load more books. Please check your internet
        connection and try again."
        />
      )}
    </Box>
  );
};

export default BookLists;
