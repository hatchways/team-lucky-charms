import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 12,
    h1: {
      fontSize: 34,
      fontWeight: '500',
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: '500',
      color: '#999',
    },
    subtitle2: {
      fontSize: 22,
      fontWeight: '500',
      color: '#999',
    },
  },
  appTheme: {
    background: '#69E781',
    warning: '#FF0000',
    divider: '#F8F8F8',
  },

  palette: {
    primary: { main: '#69E781' },
    secondary: { main: '#ffffff' },
  },
});
