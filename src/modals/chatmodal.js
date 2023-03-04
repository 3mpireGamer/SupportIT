import React, { useEffect, useState } from 'react'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import { ClickAwayListener, Grid, IconButton, Popper, TextField, Typography } from '@mui/material';
import { getChatHeight, getMessages, generateBoundingRect } from '../components/chat'


export function ChatModal({ tickets, openedTicket, openTicket, newMessage, authenticated }) {
   const [virtualEl, setVirtualEl] = useState();
   const [placement, setPlacement] = useState();
   const selectedTicket = tickets.filter(ticket => {
      return ticket.id === openedTicket
   });
   const messages = selectedTicket.length !== 0 ? getMessages(selectedTicket[0], authenticated) : '';
   useEffect(() => {
      let {boundingClientRect, placementBool} = generateBoundingRect();
      setVirtualEl({
         getBoundingClientRect: boundingClientRect,
      });
      setPlacement(placementBool ? 'top-end': 'bottom-end');
      window.addEventListener('scroll', () => {
         let {boundingClientRect, placementBool} = generateBoundingRect();
         setVirtualEl({
            getBoundingClientRect: boundingClientRect,
         });
         setPlacement(placementBool ? 'top-end': 'bottom-end');
      });
      let eventTimer = null;
      window.addEventListener('resize', () => {
         if (eventTimer !== null) {
            clearTimeout(eventTimer);
         }
         eventTimer = setTimeout(() => {
            let {boundingClientRect, placementBool} = generateBoundingRect();
            setVirtualEl({
               getBoundingClientRect: boundingClientRect,
            });
            setPlacement(placementBool ? 'top-end': 'bottom-end');
         }, 150);
      });
   }, []);

   const handleNewMessage = (ticket, e=false) => {
      if (e) {
         newMessage(ticket, e.target.value.replace(/(\r\n|\n|\r)/gm, "")); 
         setTimeout(() => {e.target.value = ''}, 1);
      } else {
         let messageBox = document.getElementById('content');
         messageBox.focus();
         newMessage(ticket, messageBox.value.replace(/(\r\n|\n|\r)/gm, ""));
         setTimeout(() => {messageBox.value = ''}, 1);
      }
   }

   return (
   <Popper open={Boolean(openedTicket)} placement={placement} anchorEl={virtualEl} sx={{borderRadius: '4px', backgroundColor: 'white'}}>
      <ClickAwayListener onClickAway={() => {openTicket(0)}}> 
      <Grid container width='440px' spacing={3} padding={2}>
         <Grid item xs={2}><ChatBubbleOutlineIcon /></Grid>
         <Grid item xs={10}><Typography textAlign='right' paddingRight={1}>
            Case Number: {selectedTicket.length !== 0 ? selectedTicket[0].caseno : ''}
         </Typography></Grid>
         <Grid item xs={12} height={getChatHeight() + 'px'} sx={{overflow: 'scroll', overflowX: 'hidden'}}>
            <Grid container direction='column' spacing={2}>{messages}</Grid>
         </Grid>
         <Grid item xs={10}><TextField fullWidth sx={{backgroundColor: 'secondary.main', borderRadius: '4px'}} 
         onKeyDown={(e) => {if (e.key === 'Enter') {handleNewMessage(selectedTicket[0], e)}}}
         id='content' variant='outlined' label='Send Message' multiline maxRows={3} minRows={3}></TextField></Grid>
         <Grid item xs={2}><IconButton color='primary' onClick={() => {handleNewMessage(selectedTicket[0])}}><SendIcon /></IconButton></Grid>
      </Grid>
      </ClickAwayListener>
   </Popper>
);}
