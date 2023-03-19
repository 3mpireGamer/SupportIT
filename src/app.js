import React, { useCallback, useState } from "react";
import { AppBar } from "@mui/material";
import { Ticketing } from "./components/ticketing";
import { Head } from "./components/head";
import { Auth } from "./components/auth"
import { firestoreInit } from "./components/firebase";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { getTheme } from "./utils";


const fs = firestoreInit();
export const FirestoreContext = React.createContext();
export const AuthContext = React.createContext();

export function App () {
   const [authenticated, authenticate] = useState('');
   const [refresh, toggleRefresh] = useState(false);
   const [theme, setTheme] = useState(getTheme);

   // eslint-disable-next-line
   const setMode = useCallback((mode) => {
      //Set dark mode
      // eslint-disable-next-line
   }, [setTheme])

   return (
   <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={authenticated}><FirestoreContext.Provider value={fs}>
         <AppBar id='head' position='static'><Head authenticate={authenticate} refresh={refresh} toggleRefresh={toggleRefresh} /></AppBar>
         {authenticated ? <Ticketing refresh={refresh} toggleRefresh={toggleRefresh} /> : <Auth authenticate={authenticate} />}
      </FirestoreContext.Provider></AuthContext.Provider>
   </ThemeProvider>
)}
