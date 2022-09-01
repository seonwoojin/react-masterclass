import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import reset from "styled-reset";
import App from "./App";
import { theme } from "./theme";

const queryClient = new QueryClient();

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');


${reset}

* {
  box-sizing: border-box;
}
body {
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 300;
  color:${(props) => props.theme.white.darker};
  line-height: 1.2;
  background-color: black;
}
a {
  text-decoration: none;
  color:inherit;
}
`;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </RecoilRoot>
);
