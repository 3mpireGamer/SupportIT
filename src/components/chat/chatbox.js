import React, { useCallback, useContext, useEffect } from 'react'
import { elementWidth, modTicket } from '../../utils/utils';
import { AuthContext, FirestoreContext, RefreshContext } from '../../app';
import { updateTicket } from '../../utils/firebase';
import { Stack } from '@mui/system';
import { MessagingHead, Messages, MessageBox } from './chat'
import { Box, Typography } from '@mui/material';
import { useLiveTicketUpdates } from '../../utils/hooks'


export function ChatBox({ openedTicket, closeModal, completeRender }) {
   const toggleRefresh = useContext(RefreshContext);
   const authenticated = useContext(AuthContext);
   const fs = useContext(FirestoreContext);

   const { selectedTicket, error } = useLiveTicketUpdates(fs, openedTicket);

   const handleNewMessage = useCallback((ticket, e) => {
      const messageBox = e.target;
      messageBox.focus();
      const message = messageBox.value.replace(/(\r\n|\n|\r)/gm, "")
      if (message) {updateTicket(fs.db, modTicket(ticket, authenticated.username, message))}
      setTimeout(() => {messageBox.value = ''}, 1);
   }, [fs.db, authenticated]);

   const ticketCloser = useCallback((ticket) => {
      closeModal();
      toggleRefresh();
      ticket.status = 'Closed';
      updateTicket(fs.db, modTicket(ticket, authenticated.username, authenticated.username + ' closed this ticket. '));
   }, [closeModal, fs.db, authenticated, toggleRefresh]);
   
   useEffect(() => {if(!error && selectedTicket.messages) completeRender()});

   if (error) return <Box width='380px'><Typography color='error' textAlign='center' variant='h5'>Ticket Not Found<br />Refresh to Update Tickets</Typography></Box>
   if (!selectedTicket.messages) return <Box width={elementWidth + 'px'}><Typography textAlign='center' variant='h5'>Loading Ticket...</Typography></Box>
   return (
   <Stack direction="column" justifyContent="flex-end" alignItems="center" width='380px' backgroundColor='primary.light'>
      <MessagingHead closeModal={closeModal} ticketCloser={ticketCloser} selectedTicket={selectedTicket} />
      <Messages ticket={selectedTicket} />
      <MessageBox handleNewMessage={handleNewMessage} selectedTicket={selectedTicket} />
   </Stack> 
)}
