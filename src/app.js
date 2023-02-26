import React, { useState } from "react";
import { AppBar, Box } from "@mui/material";
import { Ticketing } from "./components/ticketing";
import { Head } from "./components/head";
import { Auth } from "./components/auth"
import { firebaseInit } from "./components/firebase/firebase";

export function App () {
   const [authenticated, authenticate] = useState('');
   const [tickets, setTickets] = useState(
      firebaseInit()   
   );
   console.log(tickets);

   const addTicket = (ticket) => {
      ticket.caseno = tickets.length + 1
      setTickets(tickets.concat([ticket]));
   }

   return (
   <Box sx={{backgroundColor: 'primary.light', alignContent: 'center'}}>
      <AppBar id='head' color='secondary' position='static'><Head addTicket={addTicket} authenticated={authenticated} authenticate={authenticate}/></AppBar>
      {authenticated ? <Ticketing tickets={tickets}/> : <Auth authenticate={authenticate}/>}
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