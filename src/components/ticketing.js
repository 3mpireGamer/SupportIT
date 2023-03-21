import React, { useContext, useEffect, useState } from 'react';
import { Pagination, Stack, Tab, Tabs } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import { AuthContext, FirestoreContext } from '../app';
import { getTickets } from './firebase';
import { ChatModal } from '../modals/chatmodal'
import { Tickets } from './tickets';


const pageSize = 10;

export function Ticketing({ refresh, toggleRefresh }) {
   const authenticated = useContext(AuthContext);
   const fs = useContext(FirestoreContext);
   const [tickets, setTickets] = useState([]);
   const [openedTicket, openTicket] = useState('');
   const [view, setView] = useState(authenticated.username);
   const [page, setPage] = useState({
      start: 0, 
      end: pageSize,
      count: Math.ceil(tickets.length/pageSize) 
   });
   
   useEffect(() => {
      getTickets(fs.query, view).then(result => {
         let newCount = Math.ceil(result.length/pageSize);
         if (newCount !== page.count) {
            setPage({
               start: 0, 
               end: pageSize, 
               count: newCount
            });
         }
         setTickets(result.slice(page.start, page.end));
      });
   }, [fs.query, view, authenticated, refresh, page.start, page.end, page.count]);

   console.log(page)
   //Need Grid with Mutiple breakpoints for window resizing and small displays
   return ( 
   <Stack alignItems='center' spacing={2} width='100%' minHeight='600px' mt={1}>
      <Tabs value={view} onChange={(_, view) => {setView(view)}}>
         <Tab value={false} label='View All Cases' />
         <Tab value={authenticated.username} label='View My Cases' />
         <Tab value={'Closed'} label='View Closed Cases' />
         <Tab onClick={() => {toggleRefresh(!refresh); setView(view)}} label={<SyncIcon />} />
      </Tabs>
      <Tickets tickets={tickets} openTicket={openTicket}/>
      <Pagination count={page.count} onChange={(_, pageNum) => {
         let start = (pageNum - 1) * pageSize;
         let end = (pageNum - 1) * pageSize + pageSize;
         setPage({...page, start, end})
      }} />
      <ChatModal openedTicket={openedTicket} openTicket={openTicket} refresh={refresh} toggleRefresh={toggleRefresh} />
   </Stack>
   )
}
