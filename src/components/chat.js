import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { modTicket, parseMonth } from '../utils';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CancelPresentationTwoToneIcon from '@mui/icons-material/CancelPresentationTwoTone';
import SendIcon from '@mui/icons-material/Send';
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
      <Grid container width='440px' spacing={3} padding={2} justifyContent="center" alignItems="center">
         <MessagingHead confirm={confirm} setConfirm={setConfirm} closeTicket={closeTicket} selectedTicket={selectedTicket} />
         <Grid item xs={12} height={getChatHeight() + 'px'} sx={{overflow: 'scroll', overflowX: 'hidden'}}>
            <Messages ticket={selectedTicket} />
         </Grid>
         <MessageBox handleNewMessage={handleNewMessage} selectedTicket={selectedTicket} />
      </Grid> 
   )}
   return <></>
}
function MessagingHead({ confirm, setConfirm, closeTicket, selectedTicket }) {
   return (<Grid item xs={12}><Grid container justifyContent='center'>
   <Grid item xs={2}><ChatBubbleOutlineIcon fontSize='large' /></Grid>
   <Grid item xs={10}><Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
      <TicketCloser confirm={confirm} setConfirm={setConfirm} closeTicket={closeTicket} selectedTicket={selectedTicket} />
   </Stack></Grid></Grid></Grid>
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

   return (<Stack spacing={2}>{ticket.messages.map(message => {
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
   return (<>
   <Grid item xs={10}>
      <TextField fullWidth sx={{backgroundColor: 'secondary.main', borderRadius: '4px'}} 
         onKeyDown={(e) => {if (e.key === 'Enter') {handleNewMessage(selectedTicket, e)}}}
         id='content' variant='outlined' label='Send Message' multiline maxRows={3} minRows={3} />
   </Grid><Grid item xs={2}>
      <IconButton color='primary' onClick={() => {handleNewMessage(selectedTicket)}}><SendIcon fontSize='large'/></IconButton>
   </Grid></>
)}

function formatDate(date) {
   return parseMonth(date.getMonth()) + ' ' + date.getDate() + ' - ' + date.getHours() + ':' + date.getMinutes()
}
