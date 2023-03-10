import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { parseMonth } from '../utils';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CancelPresentationTwoToneIcon from '@mui/icons-material/CancelPresentationTwoTone';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import { AuthContext, FirestoreContext } from '../app';
import { generateId } from '../utils';
import { updateTicket, getLiveUpdate, getOpenedTicket } from '../components/firebase';
import { onSnapshot } from 'firebase/firestore';
import { getChatHeight } from '../modals/chatmodal';

let unsubscribe = () => {};

export function Chat({ openedTicket, openTicket, refresh, toggleRefresh }) {
   const authenticated = useContext(AuthContext);
   const fs = useContext(FirestoreContext);
   const [selectedTicket, setTicket] = useState({});
   useEffect(() => {
      if (openedTicket) {
         unsubscribe = onSnapshot(getOpenedTicket(fs.db, openedTicket), (snapshot) => {
            getLiveUpdate(snapshot).then(result => {setTicket(result);});
      })} 
      return () => {unsubscribe();}
   }, [fs, openedTicket]);
   const [confirm, setConfirm] = useState(false);
   const newMessage = useCallback((ticket, message) => {
      if (message) {
         let date = new Date();
         ticket.updated = date;
         ticket.messages.push({
            id: generateId(), 
            author: authenticated,
            content: message, 
            dateTime: date
         })
         updateTicket(fs.db, ticket);
      }
   }, [fs.db, authenticated])

   const handleNewMessage = useCallback((ticket, e=false) => {
      let messageBox = e ? e.target : document.getElementById('content');
      messageBox.focus();
      newMessage(ticket, messageBox.value.replace(/(\r\n|\n|\r)/gm, "")); 
      setTimeout(() => {messageBox.value = ''}, 1);

   }, [newMessage])

   const closeTicket = useCallback((ticket) => {
      setConfirm(false); 
      openTicket('');
      setTicket({});
      toggleRefresh(!refresh);
      let date = new Date();
      ticket.updated = date;
      ticket.status = 'Closed';
      ticket.messages.push({
         id: generateId(),
         author: authenticated, 
         content: authenticated + ' closed this ticket. ', 
         dateTime: date
      });
      updateTicket(fs.db, ticket);
   }, [openTicket, fs.db, authenticated, refresh, toggleRefresh])
   
   if (selectedTicket.messages) { return (
      <Grid container width='440px' spacing={3} padding={2}>
      <Grid item xs={2}><ChatBubbleOutlineIcon fontSize='large'/></Grid>
      <Grid item xs={2} /><Grid item xs={8} alignContent='right'>
      {confirm ? <>
         <IconButton variant='text' color='error' onClick={() => {setConfirm(false)}}><CancelPresentationTwoToneIcon /></IconButton>
         <Button variant='text' size='large' onClick={() => {closeTicket(selectedTicket)}}>Close {selectedTicket.caseno}?</Button>
      </> :
      <>
         <IconButton hidden><CancelPresentationTwoToneIcon /></IconButton>
         <Button variant='text' size='large' onClick={() => {setConfirm(true)}}>Case {selectedTicket.caseno}</Button>
      </>}
      </Grid>
      <Grid item xs={12} height={getChatHeight() + 'px'} sx={{overflow: 'scroll', overflowX: 'hidden'}}>
         <Grid container direction='column' spacing={2}><Messages ticket={selectedTicket} /></Grid>
      </Grid>
      <Grid item xs={10}><TextField fullWidth sx={{backgroundColor: 'secondary.main', borderRadius: '4px'}} 
      onKeyDown={(e) => {if (e.key === 'Enter') {handleNewMessage(selectedTicket, e)}}}
      id='content' variant='outlined' label='Send Message' multiline maxRows={3} minRows={3}></TextField></Grid>
      <Grid item xs={2}><IconButton color='primary' onClick={() => {handleNewMessage(selectedTicket)}}><SendIcon /></IconButton></Grid>
      </Grid> 
   )}
   return <></>
}

function Messages({ ticket }) {
   const authenticated = useContext(AuthContext);
   const latestMessage = useRef();
   useEffect(() => {
      latestMessage.current.scrollIntoView();
   }, [ticket])

   return (ticket.messages.map(message => {
      return authenticated === message.author
      ? (<Grid item ref={latestMessage} key={message.id}><Grid container>
      <Grid item xs={2} /><Grid item xs={10}>
         <Box sx={{ border: 1, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: '8px', padding: '8px'}}>
            <Typography textAlign='right' fontWeight='bold'>{formatDate(message.dateTime)} | {message.author}</Typography>
            <Typography textAlign='right'>{message.content}</Typography>
         </Box>
      </Grid></Grid></Grid>)
      : (<Grid item ref={latestMessage} key={message.id}><Grid container>
      <Grid item xs={10}>
         <Box sx={{ border: 1, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: '8px', padding: '8px'}}>
            <Typography textAlign='left' fontWeight='bold'>{message.author} | {formatDate(message.dateTime)}</Typography>
            <Typography textAlign='left'>{message.content}</Typography>
         </Box>
      </Grid><Grid item xs={2} />
      </Grid></Grid>)
   }));
}

function formatDate(date) {
   return parseMonth(date.getMonth()) + ' ' + date.getDate() + ' - ' + date.getHours() + ':' + date.getMinutes()
}
