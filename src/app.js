import React, { useState } from "react";
import { AppBar, Box } from "@mui/material";
import { Ticketing } from "./components/ticketing";
import { Head } from "./components/head";
import { Auth } from "./components/auth"
import { firestoreInit } from "./components/firebase/firebase";


const fs = firestoreInit();
export const FirestoreContext = React.createContext();
export const AuthContext = React.createContext();

export function App () {
   const [authenticated, authenticate] = useState('');

   return (
   <Box sx={{alignContent: 'center', height: '100%'}}>
   <AuthContext.Provider value={authenticated}><FirestoreContext.Provider value={fs}>
      <AppBar id='head' color='secondary' position='static'><Head authenticate={authenticate}/></AppBar>
      {authenticated ? <Ticketing/> : <Auth authenticate={authenticate} />}
      </FirestoreContext.Provider></AuthContext.Provider>
   </Box>
)}
