import Books from "./components/books/Books";
import { ChakraProvider as Chakra } from "@chakra-ui/react";
import theme from "./theme-config/theme";

function App() {
  return (
    <Chakra resetCSS={true} theme={theme}>
      <Books />
    </Chakra>
  );
}

export default App;
