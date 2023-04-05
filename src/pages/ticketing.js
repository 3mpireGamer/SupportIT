import React, { useContext, useEffect, useState } from 'react';
import { Pagination, Stack, Tab, Tabs } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import { AuthContext, FirestoreContext, RefreshContext } from '../app';
import { getTickets } from '../utils/firebase';
import { ChatModal } from '../components/chat/chatmodal'
import { Tickets } from '../components/tickets';
import { ScrollModal } from '../components/scrollmodal';


const pageSize = 10;

export function Ticketing({ refresh }) {
   const toggleRefresh = useContext(RefreshContext);
   const authenticated = useContext(AuthContext);
   const fs = useContext(FirestoreContext);
   const [tickets, setTickets] = useState([]);
   const [openedTicket, openTicket] = useState(''); // state double changes when clicking away onto another ticket
   const [view, setView] = useState(authenticated.username);
   const [page, setPage] = useState({
      start: 0, 
      end: pageSize,
      count: Math.ceil(tickets.length/pageSize) 
   });
   
   useEffect(() => {
      getTickets(fs.query, view).then(result => {
         updatePagination(result.length, page.count, setPage)
         setTickets(result.slice(page.start, page.end));
      });
   }, [fs.query, view, authenticated, refresh, page.start, page.end, page.count]);

   const closeModal = () => openTicket('');
   //Need Grid with Mutiple breakpoints for window resizing and small displays
   return (<Stack direction='row' justifyContent='space-evenly'>
   <ScrollModal openedTicket={openedTicket} />
   <Stack alignItems='center' spacing={2} width='100%' minHeight='100vh' mt={1}>
      <Tabs value={view} onChange={(_, view) => {setView(view)}}>
         <Tab value={false} label='All Cases' />
         <Tab value={authenticated.username} label='My Cases' />
         <Tab value={'Closed'} label='Closed Cases' />
         <Tab onClick={() => {setView(view); toggleRefresh()}} label={<SyncIcon />} />
      </Tabs>
      <Tickets tickets={tickets} openTicket={openTicket}/>
      <Pagination count={page.count} onChange={(_, pageNum) => {
         let start = (pageNum - 1) * pageSize;
         let end = (pageNum - 1) * pageSize + pageSize;
         setPage({...page, start, end})
      }} />
   </Stack>
   <ChatModal openedTicket={openedTicket} closeModal={closeModal} />
   </Stack>)
}

function updatePagination(length, count, setPage) {
   const newCount = Math.ceil(length/pageSize);
   if (newCount !== count) {
      setPage({
         start: 0, 
         end: pageSize, 
         count: newCount
      });
   }
}
