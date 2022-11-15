import { Box, Flex } from "@chakra-ui/react";
import moment from "moment";

type BookLayoutProps = {
  book: BookTypes;
  hasMaxWidth?: boolean;
};

const BookLayout = ({ book, hasMaxWidth }: BookLayoutProps) => {
  return (
    <Box
      p="2"
      bg="#fff"
      borderRadius="md"
      data-testid="book"
      id={book.isbn}
      maxW={hasMaxWidth ? "400px" : ""}
      boxShadow="0px 0px 2px rgba(0, 0, 0, .2)"
    >
      <Flex p="2px">
        <Box fontWeight="semibold" flexBasis="45%">
          Name:
        </Box>
        <Box data-testid="name" pl="2" flexBasis="55%">
          {book.name}
        </Box>
      </Flex>
      <Flex p="2px">
        <Box fontWeight="semibold" flexBasis="45%">
          Publisher:
        </Box>
        <Box data-testid="publisher" pl="2" flexBasis="55%">
          {book.publisher}
        </Box>
      </Flex>
      <Flex p="2px">
        <Box fontWeight="semibold" flexBasis="45%">
          ISBN:
        </Box>
        <Box data-testid="isbn" pl="2" flexBasis="55%">
          {book.isbn}
        </Box>
      </Flex>
      <Flex p="2px">
        <Box fontWeight="semibold" flexBasis="45%">
          Authors:
        </Box>

        <Box pl="2" flexBasis="55%">
          {book.authors.map((author, index) =>
            index !== book.authors.length - 1 ? (
              <Box
                data-testid="author"
                pr="2"
                key={book.isbn + author}
                as="span"
              >
                <Box data-testid="author-name" as="span">
                  {author},
                </Box>
              </Box>
            ) : (
              <Box
                data-testid="author"
                pr="2"
                key={book.isbn + author}
                as="span"
              >
                <Box data-testid="author-name" as="span">
                  {author}
                </Box>
              </Box>
            )
          )}
        </Box>
      </Flex>
      <Flex p="2px">
        <Box fontWeight="semibold" flexBasis="45%">
          End Date:
        </Box>
        <Box data-testid="released" pl="2" flexBasis="55%">
          {moment(book.released).format("L")}
        </Box>
      </Flex>
      <Flex p="2px">
        <Box fontWeight="semibold" flexBasis="45%">
          Country:
        </Box>
        <Box data-testid="country" pl="2" flexBasis="55%">
          {book.country}
        </Box>
      </Flex>
      <Flex p="2px">
        <Box fontWeight="semibold" flexBasis="45%">
          Media Type:
        </Box>
        <Box data-testid="media" pl="2" flexBasis="55%">
          {book.mediaType}
        </Box>
      </Flex>
      <Flex p="2px">
        <Box fontWeight="semibold" flexBasis="45%">
          No. of Pages:
        </Box> 
         <Box data-testid="pages" pl="2" flexBasis="55%">
          {book.numberOfPages}
        </Box> 
      </Flex>
    </Box>
  );
};

export default BookLayout;
