import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 12,
    h1: {
      // could customize the h1 variant as well
    },
  },
  appTheme: {
    background: "#69E781",
    warning: "#FF0000",
  },

  palette: {
    primary: { main: "#69E781" },
  },
});
