import * as React from "react";
import { FormControl, FormLabel, Select } from "@chakra-ui/react";

type FilterFieldProps = {
  onFilter: (filter: BookKeys) => void;
};

const FilterField = ({ onFilter }: FilterFieldProps) => {
  const [selectValue, setSelectValue] = React.useState("name");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilter(e.currentTarget.value as BookKeys);
    setSelectValue(e.currentTarget.value);
  };

  return (
    <FormControl
      id="filter"
      display="flex"
      alignItems="center"
      maxW={{ sm: "400px" }}
    >
      <FormLabel minW="65px">Filter by:</FormLabel>
      <Select value={selectValue} borderRadius="full" onChange={handleChange}>
        <option value="publisher">Publisher</option>
        <option value="name">Name</option>
        <option value="isbn">ISBN</option>
        <option value="released">End Date</option>
        <option value="authors">Authors</option>
        <option value="characters">Characters Name</option>
        <option value="culture">Characters Culture</option>
      </Select>
    </FormControl>
  );
};

export default FilterField;
