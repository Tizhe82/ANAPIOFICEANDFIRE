import {
  FormControl,
  FormLabel,
  Input,
  VisuallyHidden,
} from "@chakra-ui/react";

type SearchFieldProps = {
  onSearch: (query: string) => void;
  searchValue: string;
  filter: BookKeys;
};

const SearchField = ({ searchValue, onSearch, filter }: SearchFieldProps) => {
  return (
    <FormControl
      mr="4"
      id="search"
      maxW={{ sm: "323px" }}
      mb={{ base: "4", sm: "0" }}
    >
      <VisuallyHidden>
        <FormLabel htmlFor="search">Search books...</FormLabel>
      </VisuallyHidden>
      <Input
        value={searchValue}
        type={filter !== "released" ? "search" : "date"}
        id="search"
        borderRadius="full"
        autoComplete="off"
        placeholder="Search books..."
        onChange={(e) => onSearch(e.currentTarget.value.trimStart())}
      />
    </FormControl>
  );
};

export default SearchField;
