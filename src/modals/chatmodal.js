import React, { useEffect, useState } from 'react'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, ClickAwayListener, Grid, IconButton, Popover, Popper, TextField } from '@mui/material';
import { getChatHeight, getMessages, generateBoundingRect } from '../components/chat'


export function ChatModal({ tickets, openedTicket, openTicket, newMessage, authenticated, closeTicket}) {
   const [virtualEl, setVirtualEl] = useState();
   const [placement, setPlacement] = useState();
   const [confirm, setConfirm] = useState(false);
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
   <Popper open={Boolean(openedTicket)} placement={placement} anchorEl={virtualEl} sx={{borderRadius: '8px', backgroundColor: 'white'}}>
      <ClickAwayListener onClickAway={() => {openTicket(0)}}>
      <Box sx={{ border: 1, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: '8px', padding: '8px'}}>
      <Grid container width='440px' spacing={3} padding={2}>
         <Grid item xs={2}><ChatBubbleOutlineIcon fontSize='large'/></Grid>
         <Grid item xs={4}></Grid><Grid item xs={6}>
         {confirm ? <Button onClick={() => {closeTicket(selectedTicket[0]); setConfirm(false); openTicket(0)}}>Close {selectedTicket[0].caseno}?</Button>
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
