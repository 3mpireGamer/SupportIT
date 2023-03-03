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
      ticket.caseno = tickets.length + 1
      ticket.messages = [{
         id: 1,
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


/*
Array(1).fill({
   author: 'Luca', 
   title: 'Test', 
   status: 'Open', 
   category: 'Development',
   desc: 'This is a development test of the ticketing display grid. We can make the grid even bigger, wow!', 
   caseno: 1, 
   created: '1 January 2023',
   updated: '2 January 2023',
   messages: [{
      id: 0,
      author: 'Agent', 
      dateTime: '2 January 2023, 10:03 AM',
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
   }, {
      id: 1,
      author: 'Luca', 
      dateTime: '2 January 2023, 10:07 AM',
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
   }]
})
*/