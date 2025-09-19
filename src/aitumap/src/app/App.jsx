import {
  ChakraProvider,
  ThemeProvider,
  theme,
  ColorModeProvider,
  CSSReset,
} from "@chakra-ui/react";
import Home from "../page/Home";
import { isIOS } from "mobile-device-detect";
import MapProvider from "./MapProvider";

function App({ search }) {
  return (
    <MapProvider search={search}>
      <ChakraProvider>
        <ThemeProvider theme={theme}>
          <ColorModeProvider>
            <CSSReset />
            <div
              className="aitumap-root w-full h-full"
              style={{
                background: "var(--card-bg)",
                color: "var(--card-text)",
                borderColor: "var(--card-border)",
                // Add more variables as needed for your map UI
              }}
            >
              <Home isIOS={isIOS} />
            </div>
          </ColorModeProvider>
        </ThemeProvider>
      </ChakraProvider>
    </MapProvider>
  );
}

export default App;
