import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightBlue, deepPurple, deepOrange } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      light: lightBlue[400], 
      main: lightBlue['A400'], 
      dark: lightBlue[800],
    },
    secondary: {
      light: deepPurple[400], 
      main: deepPurple['A400'], 
      dark: deepPurple[800],
    }, 
    error: {
      light: deepOrange[500], 
      main: deepOrange[600], 
      dark: deepOrange['A700'],
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
