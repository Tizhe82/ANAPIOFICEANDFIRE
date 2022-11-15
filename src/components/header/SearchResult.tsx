import { Box, Link } from "@chakra-ui/react";
import { Link as ScrollLink } from "react-scroll";

type SearchResultProps = {
  queryItems: BookTypes[];
  onClearQuery: () => void;
};

const SearchResult = ({ queryItems, onClearQuery }: SearchResultProps) => {
  return (
    <Box
      bg="#fff"
      mt="1"
      w={{ base: "80%", sm: "400px" }}
      maxH="400px"
      overflowY="auto"
      top={{ base: "92%", sm: "70px" }}
      borderRadius="md"
      position="absolute"
      data-testid="search-result"
      display={queryItems.length === 0 ? "none" : "block"}
      border=".5px solid rgba(0, 0, 0, .15)"
      boxShadow="0 1px 2px rgba(0, 0, 0, .15)"
    >
      {queryItems.map((queryItem) => (
        <Link
          p="2"
          key={queryItem.isbn}
          display="block"
          as={ScrollLink}
          offset={-24}
          duration={300}
          to={queryItem.isbn}
          smooth={"easeInOutQuint"}
          activeClass="active"
          data-testid="result-link"
          onClick={onClearQuery}
          _hover={{ textDecor: "none", bg: "primary", color: "#fff" }}
        >
          {queryItem.name}
        </Link>
      ))}
    </Box>
  );
};

export default SearchResult;
