import React, { useCallback, useContext, useEffect, useState } from 'react'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, ClickAwayListener, Grid, IconButton, Popper, TextField } from '@mui/material';
import { getChatHeight, getMessages, generateBoundingRect } from '../components/chat'
import { AuthContext, FirestoreContext } from '../app';
import { generateId } from '../components/utils';
import { updateTicket, getLiveTickets } from '../components/firebase/firebase';
import { onSnapshot } from 'firebase/firestore';


export function ChatModal({ openedTicket, openTicket}) {
   const authenticated = useContext(AuthContext);
   const fs = useContext(FirestoreContext);

   const [tickets, setTickets] = useState([]);
   useEffect(() => {
      onSnapshot(fs.collection, snapshot => {
         getLiveTickets(snapshot).then(result => {setTickets(result)});
   })}, [fs.collection]);

   const [virtualEl, setVirtualEl] = useState();
   const [placement, setPlacement] = useState();
   const [confirm, setConfirm] = useState(false);
   const selectedTicket = tickets.filter(ticket => {
      return ticket.id === openedTicket
   });
   const messages = selectedTicket.length !== 0 ? getMessages(selectedTicket[0], authenticated) : '';
   
   const setAnchor = () => {
      let {boundingClientRect, placementBool} = generateBoundingRect();
      setVirtualEl({
         getBoundingClientRect: boundingClientRect,
      });
      setPlacement(placementBool ? 'top-end': 'bottom-end');
   }
   
   useEffect(() => {
      setAnchor();
      window.addEventListener('scroll', () => {
         setAnchor();
      });
      let eventTimer = null;
      window.addEventListener('resize', () => {
         if (eventTimer !== null) {
            clearTimeout(eventTimer);
         }
         eventTimer = setTimeout(() => {
            setAnchor();
         }, 150);
      });
   }, []);

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

   const handleNewMessage = (ticket, e=false) => {
      let messageBox = e ? e.target : document.getElementById('content');
      messageBox.focus();
      newMessage(ticket, messageBox.value.replace(/(\r\n|\n|\r)/gm, "")); 
      setTimeout(() => {messageBox.value = ''}, 1);

   }

   const closeTicket = useCallback((ticket) => {
      setConfirm(false); 
      openTicket('');
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
   }, [openTicket, fs.db, authenticated])

   return (
   <Popper open={Boolean(openedTicket)} placement={placement} anchorEl={virtualEl} sx={{borderRadius: '8px', backgroundColor: 'white'}}>
      <ClickAwayListener onClickAway={() => {openTicket('')}}>
      <Box sx={{ border: 1, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: '8px', padding: '8px'}}>
      <Grid container width='440px' spacing={3} padding={2}>
         <Grid item xs={2}><ChatBubbleOutlineIcon fontSize='large'/></Grid>
         <Grid item xs={4}></Grid><Grid item xs={6}>
         {confirm ? <Button onClick={() => {closeTicket(selectedTicket[0])}}>Close {selectedTicket[0].caseno}?</Button>
         : <Button variant='text' size='large' onClick={() => {setConfirm(true)}}>
            Case {selectedTicket.length !== 0 ? selectedTicket[0].caseno : ''}
         </Button>}
         
         
         </Grid>
         <Grid item xs={12} height={getChatHeight() + 'px'} sx={{overflow: 'scroll', overflowX: 'hidden'}}>
            <Grid container direction='column' spacing={2}>{messages}</Grid>
         </Grid>
         <Grid item xs={10}><TextField fullWidth sx={{backgroundColor: 'secondary.main', borderRadius: '4px'}} 
         onKeyDown={(e) => {if (e.key === 'Enter') {handleNewMessage(selectedTicket[0], e)}}}
         id='content' variant='outlined' label='Send Message' multiline maxRows={3} minRows={3}></TextField></Grid>
         <Grid item xs={2}><IconButton color='primary' onClick={() => {handleNewMessage(selectedTicket[0])}}><SendIcon /></IconButton></Grid>
      </Grid>
      </Box></ClickAwayListener>
   </Popper>
);}
