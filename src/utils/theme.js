import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { blue, blueGrey, grey } from '@mui/material/colors';

export const light = responsiveFontSizes(createTheme({
   palette: {
     primary: {
         light: blue['50'], 
         main: blue['700'], 
         dark: blue['800'], 
     },
     secondary: {
         light: blueGrey['100'], 
         main: blueGrey['200'], 
         dark: blueGrey['300'], 
      }, 
      black: {
         main: '#000', 
      },
      white: {
         main: '#fff',
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

export const dark = responsiveFontSizes(createTheme({
   palette: {
      mode: 'dark', 
      primary: {
         light: grey['900'], 
         main: grey['400'], 
         dark: grey['700'], 
      },
      secondary: {
         light: blueGrey['700'], 
         main: blueGrey['800'], 
         dark: blueGrey['900'], 
      }, 
      black: {
         main: '#fff', 
      },
      white: {
         main: '#000',
      },
   }
}));
