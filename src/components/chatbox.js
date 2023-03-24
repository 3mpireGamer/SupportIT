import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { modTicket } from '../utils';
import { AuthContext, FirestoreContext, RefreshContext } from '../app';
import { updateTicket, getLiveUpdate, getOpenedTicket } from './firebase';
import { onSnapshot } from 'firebase/firestore';
import { Stack } from '@mui/system';
import { MessagingHead, Messages, MessageBox } from './chat'
import { Typography } from '@mui/material';


export function ChatBox({ openedTicket, openTicket }) {
   const toggleRefresh = useContext(RefreshContext);
   const authenticated = useContext(AuthContext);
   const fs = useContext(FirestoreContext);

   const [confirm, setConfirm] = useState(false);
   const [selectedTicket, setTicket] = useState({});
   const [error, setError] = useState(false);
   const unsubscribe = useRef(() => {});
   useEffect(() => {
      if (openedTicket) {
         unsubscribe.current = onSnapshot(getOpenedTicket(fs.db, openedTicket), (snapshot) => {
            getLiveUpdate(snapshot)
               .then(result => {
                  setTicket(result);
                  setError(false);
               })
               .catch(_ => setError(true))
      })} 
      return () => {unsubscribe.current()}
   }, [fs, openedTicket, openTicket]);


   const handleNewMessage = useCallback((ticket, e) => {
      let messageBox = e.target;
      messageBox.focus();
      let message = messageBox.value.replace(/(\r\n|\n|\r)/gm, "")
      if (message) {updateTicket(fs.db, modTicket(ticket, authenticated.username, message))}
      setTimeout(() => {messageBox.value = ''}, 1);
   }, [fs.db, authenticated])

   const closeTicket = useCallback((ticket) => {
      setConfirm(false); 
      openTicket('');
      setTicket({});
      toggleRefresh();
      ticket.status = 'Closed';
      updateTicket(fs.db, modTicket(ticket, authenticated.username, authenticated.username + ' closed this ticket. '));
   }, [openTicket, fs.db, authenticated, toggleRefresh])
   
   if (error) return <Typography color='error' textAlign='center' variant='h5'>Ticket Not Found<br />Refresh to Update Tickets</Typography>
   if (!selectedTicket.messages) return <Typography textAlign='center' variant='h5'>Loading Ticket...</Typography>
   return (
   <Stack direction="column" justifyContent="flex-end" alignItems="center" width='380px' backgroundColor='secondary.light'>
      <MessagingHead confirm={confirm} setConfirm={setConfirm} closeTicket={closeTicket} selectedTicket={selectedTicket} />
      <Messages ticket={selectedTicket} />
      <MessageBox handleNewMessage={handleNewMessage} selectedTicket={selectedTicket} />
   </Stack> 
)}
