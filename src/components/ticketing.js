import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Collapse, Pagination, Stack, Tab, Tabs, Typography } from '@mui/material';
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
   const [view, setView] = useState(authenticated.username);
   const [page, setPage] = useState({
      count: Math.ceil(tickets.length/pageSize), 
      start: 0, 
      end: pageSize
   });
   
   useEffect(() => {
      getTickets(fs.query, view).then(result => {
         setPage(p => {return {...p, count: Math.ceil(result.length/pageSize)}});
         setTickets(result.slice(page.start, page.end));
      });
   }, [fs.query, view, authenticated, refresh, page.start, page.end]);
   

   //Need Grid with Mutiple breakpoints for window resizing and small displays
   return ( 
   <Stack alignItems='center' spacing={2} width='100%' minHeight='600px' mt={1}>
      <Tabs value={view} onChange={(_, view) => {setView(view)}}>
         <Tab value={false} label='View All Cases' />
         <Tab value={authenticated.username} label='View My Cases' />
         <Tab value={'Closed'} label='View Closed Cases' />
         <Tab onClick={() => {toggleRefresh(!refresh); setView(view)}} label={<SyncIcon />} />
      </Tabs>
      <TicketList tickets={tickets} openTicket={openTicket}/>
      <Pagination count={page.count} onChange={(_, pageNum) => {
         let start = (pageNum - 1) * pageSize;
         let end = (pageNum - 1) * pageSize + pageSize;
         setPage({...page, start, end})
      }} />
      <ChatModal openedTicket={openedTicket} openTicket={openTicket} refresh={refresh} toggleRefresh={toggleRefresh} />
   </Stack>
   )
}

const TicketList = ({ tickets, openTicket }) => {
   const [expandedTicket, expandTicket] = useState('')
   
   const ticketsList = tickets.map(ticket => {
      return (
      <Card key={ticket.id} elevation={5} sx={{width: '380px'}}>
         <CardActionArea onClick={() => {openTicket(ticket.id)}}>
            <CardHeader 
               avatar={<Avatar>{ticket.author.charAt(0)}</Avatar>}
               title={ticket.title} 
               subheader={
                  ticket.caseno + ' last updated ' + formatDate(ticket.updated)
               }
            />
         </CardActionArea>
         <Collapse in={expandedTicket===ticket.id} timeout='auto' unmountOnExit>
            <CardContent>
               <Typography variant='body1'>{ticket.author} created this ticket on {formatDate(ticket.created, true)}.</Typography>
               <Typography variant='body2'>{ticket.desc}</Typography>
            </CardContent>
         </Collapse>
         <CardActions>
            <Stack direction='row' pl={7} pr={2} justifyContent='space-between' width='100%'>
            <Button onClick={() => (expandTicket(expandedTicket ? '' : ticket.id))}>Show {expandedTicket===ticket.id ? 'less' : 'more'}...</Button>
            <Button onClick={() => {openTicket(ticket.id)}}>View ticket</Button>
            </Stack>
         </CardActions>
      </Card>
   )});
   return ticketsList
}

// Values in milliseconds
const minute = 60000;
const hour = 3600000;
const day = 86400000;
const week = 604800000;
function formatDate(date, detailed=false) {
   let detailedDate = parseMonth(date.getMonth()) + ' ' + date.getDate() + ' ' + date.getFullYear()
   if (detailed) return detailedDate
   let timePassed = Date.now() - date.getTime();
   if (timePassed < minute) return 'seconds ago'
   if (timePassed < hour) {
      let minutesPassed = Math.floor(timePassed/minute)
      return minutesPassed + (minutesPassed === 1 ? ' min' : ' mins') + ' ago'
   }
   if (timePassed < day) {
      let hoursPassed = Math.floor(timePassed/hour)
      return hoursPassed + (hoursPassed === 1 ? ' hr' : ' hrs') + ' ago'
   }
   if (timePassed < week) {
      let daysPassed = Math.floor(timePassed/day)
      return daysPassed + (daysPassed === 1 ? ' day' : ' days') + ' ago'
   }
   return detailedDate
}
