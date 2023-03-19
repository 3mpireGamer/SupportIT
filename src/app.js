import React, { useState } from "react";
import { AppBar } from "@mui/material";
import { Ticketing } from "./components/ticketing";
import { Head } from "./components/head";
import { Auth } from "./components/auth"
import { firestoreInit } from "./components/firebase";


const fs = firestoreInit();
export const FirestoreContext = React.createContext();
export const AuthContext = React.createContext();

export function App () {
   const [authenticated, authenticate] = useState('');
   const [refresh, toggleRefresh] = useState(false);

   return (
   <AuthContext.Provider value={authenticated}><FirestoreContext.Provider value={fs}>
      <AppBar id='head' color='default' position='static'><Head authenticate={authenticate} refresh={refresh} toggleRefresh={toggleRefresh} /></AppBar>
      {authenticated ? <Ticketing refresh={refresh} toggleRefresh={toggleRefresh} /> : <Auth authenticate={authenticate} />}
   </FirestoreContext.Provider></AuthContext.Provider>
)}
