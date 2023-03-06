import React, { useEffect, useState } from "react";
import { AppBar, Box } from "@mui/material";
import { Ticketing } from "./components/ticketing";
import { Head } from "./components/head";
import { Auth } from "./components/auth"
import { addTicket, firestoreInit, getTickets, updateTicket } from "./components/firebase/firebase";
import { onSnapshot } from 'firebase/firestore'
import { ChatModal } from './modals/chatmodal';

const fs = firestoreInit();

export function App () {
   const [openedTicket, openTicket] = useState(0);
   const [authenticated, authenticate] = useState('');
   const [tickets, setTickets] = useState();
   const [view, setView] = useState(authenticated);

   useEffect(() => {
      onSnapshot(fs.query, snapshot => {
         getTickets(snapshot, view).then(result => {setTickets(result)});
      })
   }, [authenticated, view]);

   const newTicket = (ticket) => {
      ticket.author = authenticated;
      ticket.caseno = generateCaseNo(authenticated);
      ticket.created = new Date();
      ticket.updated = new Date();
      ticket.messages = [{
         id: generateId(),
         author: ticket.author, 
         content: 'Hello, I need help with ' + ticket.category + '. ' + ticket.desc,
         dateTime: new Date()
      }];
      addTicket(fs.collection, ticket);
   } 
   const newMessage = (ticket, message) => {
      if (message) {
         ticket.updated = new Date();
         ticket.messages.push({
            id: generateId(), 
            author: authenticated,
            content: message, 
            dateTime: new Date()
         })
         updateTicket(fs.db, ticket);
      }
   }
   const closeTicket = (ticket) => {
      ticket.updated = new Date();
      ticket.status = 'Closed';
      ticket.messages.push({
         id: generateId(),
         author: authenticated, 
         content: authenticated + ' closed this ticket. ', 
         dateTime: new Date()
      });
      updateTicket(fs.db, ticket);
   }

   return (
   <Box sx={{alignContent: 'center', height: '100%'}}>
      <AppBar id='head' color='secondary' position='static'><Head newTicket={newTicket} authenticated={authenticated} authenticate={authenticate}/></AppBar>
      {authenticated ? tickets ? <Ticketing tickets={tickets} setView={setView} openTicket={openTicket} authenticated={authenticated} />
      : null : <Auth authenticate={authenticate} />}
      {tickets ? <ChatModal tickets={tickets} openedTicket={openedTicket} openTicket={openTicket} newMessage={newMessage} authenticated={authenticated} closeTicket={closeTicket}/> : null}
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
