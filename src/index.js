import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import { blue, blueGrey, deepOrange } from '@mui/material/colors';
import { CssBaseline } from '@mui/material';

const base = responsiveFontSizes(createTheme({
  palette: {
    primary: {
      light: blue['50'], 
      main: blue['600'], 
      dark: blue['800'], 
    },
    secondary: {
      light: blueGrey['A100'], 
      main: blueGrey['100'], 
      dark: blueGrey['200'], 
    }, 
    error: {
      light: deepOrange['500'], 
      main: deepOrange['800'], 
      dark: deepOrange['A700'], 
    },
    black: {
      main: '#000000', 
    },
    white: {
      main: '#ffffff',
    },
  }, 
  typography: {
    h1: {color: 'black'}, 
    h2: {color: 'black'}, 
    h3: {color: 'black'}, 
    h4: {color: 'black'}, 
    h5: {color: 'black'}, 
    h6: {color: 'black'}, 
  }, 
}));
const theme = createTheme(base, {
  palette: {
    background: {
      default: base.palette.primary.light
  }},
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: base.palette.secondary.dark
  }}}}
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>      
);
