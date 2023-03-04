import React, { useState } from 'react';
import { Grid, Tab, Tabs, Typography } from '@mui/material';
import { ChatModal } from '../modals/chatmodal';

export function Ticketing({ tickets, setView, newMessage, authenticated }) {
   const [openedTicket, openTicket] = useState(0);
   const [tab, setTab] = useState(1);
   //Need Grid with Mutiple breakpoints for window resizing and small displays
   return ( 
   <Grid container id='ticketing' direction='column' alignItems='center' spacing={2} width='100%' minHeight='600px' mt={1}>
      <Grid item><Tabs value={tab} onChange={(e, index) => {setTab(index); setView(index)}}>
         <Tab value={1} label='View All Cases' />
         <Tab value={0} label='View My Cases' />
      </Tabs></Grid>
      <TicketList tickets={tickets} openTicket={openTicket}/>
      <ChatModal tickets={tickets} openedTicket={openedTicket} openTicket={openTicket} newMessage={newMessage} authenticated={authenticated} />
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
   return parseMonth(date.getMonth()) + ' ' + date.getDate() + ' ' + date.getFullYear()
}
function parseMonth(month) {
   switch(month) {
      case 0: return 'Jan'
      case 1: return 'Feb'
      case 2: return 'Mar'
      case 3: return 'Apr'
      case 4: return 'May'
      case 5: return 'Jun'
      case 6: return 'Jul'
      case 7: return 'Aug'
      case 8: return 'Sep'
      case 9: return 'Oct'
      case 10: return 'Nov'
      case 11: return 'Dec'
      default: return ''
   }
}