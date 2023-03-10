import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { modTicket, parseMonth } from '../utils';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CancelPresentationTwoToneIcon from '@mui/icons-material/CancelPresentationTwoTone';
import { Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import { AuthContext, FirestoreContext } from '../app';
import { updateTicket, getLiveUpdate, getOpenedTicket } from '../components/firebase';
import { onSnapshot } from 'firebase/firestore';
import { getChatHeight } from '../modals/chatmodal';
import { Stack } from '@mui/system';


export function Chat({ openedTicket, openTicket, refresh, toggleRefresh }) {
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
      if (message) {updateTicket(fs.db, modTicket(ticket, authenticated, message))}
      setTimeout(() => {messageBox.value = ''}, 1);
   }, [fs.db, authenticated])

   const closeTicket = useCallback((ticket) => {
      setConfirm(false); 
      openTicket('');
      setTicket({});
      toggleRefresh(!refresh);
      ticket.status = 'Closed';
      updateTicket(fs.db, modTicket(ticket, authenticated, authenticated + ' closed this ticket. '));
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
function MessagingHead({ confirm, setConfirm, closeTicket, selectedTicket }) {
   return (<Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} width='100%'>
   <ChatBubbleOutlineIcon fontSize='large' />
   <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
      <TicketCloser confirm={confirm} setConfirm={setConfirm} closeTicket={closeTicket} selectedTicket={selectedTicket} />
   </Stack></Stack>
)}
function TicketCloser({ confirm, setConfirm, closeTicket, selectedTicket }) {
   return confirm ? <>
      <IconButton variant='text' color='error' onClick={() => {setConfirm(false)}}><CancelPresentationTwoToneIcon /></IconButton>
      <Button variant='text' size='large' onClick={() => {closeTicket(selectedTicket)}}>Close {selectedTicket.caseno}?</Button>
   </> : <Button variant='text' size='large' onClick={() => {setConfirm(true)}}>Case {selectedTicket.caseno}</Button>
}
function Messages({ ticket }) {
   const authenticated = useContext(AuthContext);
   const latestMessage = useRef();
   useEffect(() => {
      if(latestMessage.current) {latestMessage.current.scrollIntoView()}
   }, [ticket])

   return (
   <Stack spacing={2} height={getChatHeight() + 'px'} sx={{overflow: 'scroll', overflowX: 'hidden'}}>
   {ticket.messages.map(message => {
      return authenticated === message.author ? (
      <Grid ref={latestMessage} key={message.id} container>
      <Grid item xs={2} /><Grid item xs={10}>
         <Message head={formatDate(message.dateTime) + ' | ' + message.author} content={message.content} align={'right'} />
      </Grid></Grid>
      ) : (
      <Grid ref={latestMessage} key={message.id} container>
      <Grid item xs={10}>
         <Message head={message.author + ' | ' + formatDate(message.dateTime)} content={message.content} align={'left'} />
      </Grid><Grid item xs={2} />
      </Grid>
   )})}</Stack>
)}
function Message({ head, content, align }) {
   return (
   <Box sx={{ border: 1, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: '8px', padding: '8px'}}>
      <Typography textAlign={align} fontWeight='bold'>{head}</Typography>
      <Typography textAlign={align}>{content}</Typography>
   </Box>
)}
function MessageBox({ handleNewMessage, selectedTicket }) {
   const [label, setLabel] = useState('Send Message');
   return (
   <TextField id='content' variant='outlined' label={label}
      fullWidth multiline maxRows={3} minRows={3}
      sx={{backgroundColor: 'secondary.main', borderRadius: '4px'}} 
      onKeyDown={(e) => {if (e.key === 'Enter') {handleNewMessage(selectedTicket, e)}}}
      onFocus={() => {setLabel('Press Enter to Send Message')}} onBlur={() => {setLabel('Send Message')}}
   />
)}

function formatDate(date) {
   return parseMonth(date.getMonth()) + ' ' + date.getDate() + ' - ' + date.getHours() + ':' + date.getMinutes()
}
