import React, { useContext, useEffect, useState } from 'react';
import { Grid, Pagination, Tab, Tabs, Typography } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import { AuthContext, FirestoreContext } from '../app';
import { getTickets } from './firebase';
import { ChatModal } from '../modals/chatmodal'
import { parseMonth } from '../utils';


const pageSize = 10;

export function Ticketing({ refresh, toggleRefresh }) {
   const authenticated = useContext(AuthContext);
   const fs = useContext(FirestoreContext);
   const [tickets, setTickets] = useState([]);
   const [openedTicket, openTicket] = useState('');
   const [view, setView] = useState(authenticated);
   const [page, setPage] = useState({
      count: Math.ceil(tickets.length/pageSize), 
      start: 0, 
      end: pageSize
   });
   useEffect(() => {
      setPage(p => {return {...p, count: Math.ceil(tickets.length/pageSize)}});
   }, [tickets]);
   
   useEffect(() => {
      getTickets(fs.query, view).then(result => {setTickets(result)});
   }, [fs.query, view, authenticated, refresh]);
   

   //Need Grid with Mutiple breakpoints for window resizing and small displays
   return ( 
   <Grid container id='ticketing' direction='column' alignItems='center' spacing={2} width='100%' minHeight='600px' mt={1}>
      <Grid item><Tabs value={view} onChange={(_, view) => {setView(view)}}>
         <Tab value={false} label='View All Cases' />
         <Tab value={authenticated} label='View My Cases' />
         <Tab value={'Closed'} label='View Closed Cases' />
         <Tab onClick={() => {toggleRefresh(!refresh); setView(view)}} label={<SyncIcon />} />
      </Tabs></Grid>
      <TicketList tickets={tickets.slice(page.start, page.end)} openTicket={openTicket}/>
      <Grid item xs={12}><Pagination count={page.count} onChange={(_, pageNum) => {
         let start = (pageNum - 1) * pageSize;
         let end = (pageNum - 1) * pageSize + pageSize;
         setPage({...page, start, end})
      }} /></Grid>
      <ChatModal openedTicket={openedTicket} openTicket={openTicket} refresh={refresh} toggleRefresh={toggleRefresh} />
   </Grid>
   )
}

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
