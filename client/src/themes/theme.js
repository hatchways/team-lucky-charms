import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 12,
    h1: {
      fontSize: 34,
      fontWeight: '500',
    },
    h6: {
      fontSize: 15,
      color: '#999',
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
    caption: {
      fontSize: 18,
      fontWeight: '600',
      color: '#000000',
    },
    body1: {
      fontSize: 16,
    },
  },
  appTheme: {
    background: '#69E781',
    warning: '#FF0000',
    divider: '#F8F8F8',
    icon: '#D3D3D3',
    receiverBubble: '#F0F0F0',
    senderBubble: '#bef5c8',
  },

  palette: {
    primary: { main: '#69E781' },
    secondary: { main: '#ffffff' },
  },
});
