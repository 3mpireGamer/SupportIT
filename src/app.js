import React, { useEffect, useState } from "react";
import { AppBar, Box } from "@mui/material";
import { Ticketing } from "./components/ticketing";
import { Head } from "./components/head";
import { Auth } from "./components/auth"
import { addTicket, firebaseInit, getTickets } from "./components/firebase/firebase";
import { onSnapshot } from 'firebase/firestore'

const ticketCollection = firebaseInit();

export function App () {
   const [authenticated, authenticate] = useState('admin');
   const [tickets, setTickets] = useState();

   useEffect(() => {
      onSnapshot(ticketCollection, snapshot => {
         getTickets(snapshot).then(result => {setTickets(result)})
      })
   }, [])

   const newTicket = (ticket) => {
      ticket.author = authenticated.charAt(0).toUpperCase() + authenticated.slice(1);
      ticket.caseno = generateCaseNo(authenticated);
      ticket.created = new Date();
      ticket.updated = new Date();
      ticket.messages = [{
         id: generateId(),
         content: 'Hello, I need help with ' + ticket.category + '. ' + ticket.desc,
         dateTime: '2 Jan 2023 09:23AM'
      }];
      addTicket(ticketCollection, ticket);
   }

   return (
   <Box sx={{backgroundColor: 'primary.light', alignContent: 'center'}}>
      <AppBar id='head' color='secondary' position='static'><Head newTicket={newTicket} authenticated={authenticated} authenticate={authenticate}/></AppBar>
      {authenticated ? tickets ? <Ticketing tickets={tickets}/> : null : <Auth authenticate={authenticate}/>}
   </Box>
)}

function generateCaseNo(author) {
   return ('C-' + author[0] + Math.floor(Math.random() * 10000)
      + author[author.length - 1] + Math.floor(Math.random() * 10000)).toUpperCase()
}

function generateId() {
   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let id = ''
   for (let i = 0; i < 20; i++) {
     id += chars.charAt(
       Math.floor(Math.random() * chars.length)
     )
   }
   return id
 }
