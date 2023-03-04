import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { ChatModal } from '../modals/chatmodal';

export function Ticketing({ tickets }) {
   const [openedTicket, openTicket] = useState(0);
   //Need Grid with Mutiple breakpoints for window resizing and small displays
   return ( 
   <Grid container id='ticketing' direction='column' alignItems='center' spacing={2} width='100%' minHeight='600px' mt={1}>
      <TicketList tickets={tickets} openTicket={openTicket}/>
      <ChatModal tickets={tickets} openedTicket={openedTicket} openTicket={openTicket} />
   </Grid>
);}

const TicketList = ({ tickets, openTicket }) => {
   const ticketsList = tickets.map(ticket => {
      return (
      <Grid container key={ticket.id} direction='row' maxWidth='960px'
      onClick={() => {openTicket(ticket.id)}}>
         <Grid item sx={{textAlign: 'left'}} xs={3}>
         <Typography>Case Number: {ticket.caseno}</Typography></Grid>
         <Grid item sx={{textAlign: 'left'}} xs={3}>
         <Typography>{ticket.author} | {ticket.title}</Typography></Grid>
         <Grid item sx={{textAlign: 'right'}} xs={3}>
         <Typography>Status: {ticket.status}</Typography></Grid>
         <Grid item sx={{textAlign: 'right'}} xs={3}>
         <Typography>Updated</Typography></Grid>
         <Grid item sx={{textAlign: 'left'}} xs={3}>
         <Typography>Description</Typography></Grid>
         <Grid item sx={{textAlign: 'left'}} xs={6}>
         <Typography noWrap>{ticket.desc}</Typography></Grid>
         <Grid item sx={{textAlign: 'right'}} xs={3}>
         <Typography>{formatDate(ticket.updated)}</Typography></Grid>
      </Grid>
   )});
   return (<Grid item xs={12}>{ticketsList}</Grid>)
}

function formatDate(date) {
   return parseMonth(date.getMonth()) + ' ' + date.getDay() + ' ' + date.getFullYear()
}
function parseMonth(month) {
   switch(month) {
      case 1: return 'Jan'
      case 2: return 'Feb'
      case 3: return 'Mar' 
      case 4: return 'Apr' 
      case 5: return 'May' 
      case 6: return 'Jun'
      case 7: return 'Jul'
      case 8: return 'Aug'
      case 9: return 'Sep'
      case 10: return 'Oct'
      case 11: return 'Nov' 
      case 12: return 'Dec'
      default: return ''
   }
}