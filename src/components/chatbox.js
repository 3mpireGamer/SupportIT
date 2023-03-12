import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { modTicket } from '../utils';
import { AuthContext, FirestoreContext } from '../app';
import { updateTicket, getLiveUpdate, getOpenedTicket } from './firebase';
import { onSnapshot } from 'firebase/firestore';
import { Stack } from '@mui/system';
import { MessagingHead, Messages, MessageBox } from './chat'


export function ChatBox({ openedTicket, openTicket, refresh, toggleRefresh }) {
   const authenticated = useContext(AuthContext);
   const fs = useContext(FirestoreContext);

   const [confirm, setConfirm] = useState(false);
   const [selectedTicket, setTicket] = useState({});
   const unsubscribe = useRef(() => {});
   useEffect(() => {
      if (openedTicket) {
         unsubscribe.current = onSnapshot(getOpenedTicket(fs.db, openedTicket), (snapshot) => {
            getLiveUpdate(snapshot).then(result => {setTicket(result)});
      })} 
      return () => {unsubscribe.current()}
   }, [fs, openedTicket]);


   const handleNewMessage = useCallback((ticket, e=false) => {
      let messageBox = e ? e.target : document.getElementById('content');
      messageBox.focus();
      let message = messageBox.value.replace(/(\r\n|\n|\r)/gm, "")
      if (message) {updateTicket(fs.db, modTicket(ticket, authenticated.username, message))}
      setTimeout(() => {messageBox.value = ''}, 1);
   }, [fs.db, authenticated])

   const closeTicket = useCallback((ticket) => {
      setConfirm(false); 
      openTicket('');
      setTicket({});
      toggleRefresh(!refresh);
      ticket.status = 'Closed';
      updateTicket(fs.db, modTicket(ticket, authenticated.username, authenticated.username + ' closed this ticket. '));
   }, [openTicket, fs.db, authenticated, refresh, toggleRefresh])
   
   if (selectedTicket.messages) { return (
      <Stack direction="column" justifyContent="flex-end" alignItems="center" spacing={2} width='400px'>
         <MessagingHead confirm={confirm} setConfirm={setConfirm} closeTicket={closeTicket} selectedTicket={selectedTicket} />
         <Messages ticket={selectedTicket} />
         <MessageBox handleNewMessage={handleNewMessage} selectedTicket={selectedTicket} />
      </Stack> 
   )}
   return <></>
}
