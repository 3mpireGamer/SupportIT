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
export const RefreshContext = React.createContext();

export function App () {
   const [authenticated, authenticate] = useState('');
   const [refresh, toggleRefresh] = useState(false);
   const [theme, setTheme] = useState(getTheme('light'));
   const setMode = useCallback((mode) => {
      setTheme(getTheme(mode));
   }, [setTheme])

   return (
   <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={authenticated}><FirestoreContext.Provider value={fs}>
         <RefreshContext.Provider value={() => toggleRefresh(!refresh)}>
            <AppBar id='head' position='static'><Head authenticate={authenticate} mode={theme.palette.mode} setMode={setMode} /></AppBar>
            {authenticated ? <Ticketing refresh={refresh}/> : <Auth authenticate={authenticate} />}
         </RefreshContext.Provider>
      </FirestoreContext.Provider></AuthContext.Provider>
   </ThemeProvider>
)}
