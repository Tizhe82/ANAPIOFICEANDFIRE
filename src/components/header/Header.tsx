import * as React from "react";
import { Flex } from "@chakra-ui/react";
import SearchField from "./SearchField";
import FilterField from "./FilterField";
import SearchResult from "./SearchResult";
import { searchHelper } from "../../utils/searchHelper";

type HeaderProps = {
  books: BookTypes[];
  characters: CharacterTypes[];
};

const Header = ({ books, characters }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filter, setFilter] = React.useState<BookKeys>("name");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleFilter = (filter: BookKeys) => {
    setFilter(filter);
  };

  let searchBooks: BookTypes[] = [];
  if (searchQuery)
    searchBooks = searchHelper({ filter, books, searchQuery, characters });

  return (
    <Flex
      p="5"
      my="10"
      bg="#fff"
      borderRadius="md"
      position="relative"
      direction={{ base: "column", sm: "row" }}
      boxShadow="0px 0px 2px rgba(0, 0, 0, .2)"
    >
      <SearchField filter={filter} searchValue={searchQuery} onSearch={handleSearch} />
      <FilterField onFilter={handleFilter} />
      <SearchResult queryItems={searchBooks} onClearQuery={handleClearSearch} />
    </Flex>
  );
};

export default Header;
