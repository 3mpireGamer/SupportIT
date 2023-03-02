import React, { useEffect, useState } from 'react'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { ClickAwayListener, Grid, Popper, TextField, Typography } from '@mui/material';

const chatHeight = 400

function doesChatFit() {
   let docHeight = document.getElementById('root').offsetHeight;
   let headHeight = document.getElementById('head').offsetHeight;
   return docHeight > (chatHeight + 156 + headHeight)
}
function generateBoundingRect() {
   let chatFits = doesChatFit()
   let headHeight = document.getElementById('head').offsetHeight;
   let docHeight = document.getElementById('root').offsetHeight;
   let docWidth = document.getElementById('root').offsetWidth;
   let scrollY = window.scrollY;
   let boundingClientRect = () => ({
      width: '0', height: '0', left: docWidth,
      top: chatFits 
      ? docHeight : scrollY <= (16 + headHeight) 
      ? 16 + headHeight - scrollY : scrollY <= (chatHeight + 156 + headHeight - docHeight) 
      ? 16 + headHeight - scrollY : docHeight
   })
   let placementBool = chatFits 
   ? true : scrollY <= (16 + headHeight) 
   ? false : scrollY <= (chatHeight + 156 + headHeight - docHeight) 
   ? false : true
   return ({boundingClientRect, placementBool})
}

function getMessages(ticket) {
   return (ticket.messages.map(message => {
      return ticket.author === message.author 
      ? (<Grid item key={message.id}><Grid container>
      <Grid item xs={2}></Grid><Grid item xs={10}>{message.content}</Grid>
      </Grid></Grid>)
      : (<Grid item key={message.id}><Grid container>
      <Grid item xs={10}>{message.content}</Grid><Grid item xs={2}></Grid>
      </Grid></Grid>)
   }));
}


export function ChatModal({ tickets, openedTicket, openTicket }) {
   const [virtualEl, setVirtualEl] = useState();
   const [placement, setPlacement] = useState();
   const selectedTicket = tickets.filter(ticket => {
      return ticket.id === openedTicket
   });
   const messages = selectedTicket.length !== 0 ? getMessages(selectedTicket[0]) : '';
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
   return (
   <Popper open={Boolean(openedTicket)} placement={placement} anchorEl={virtualEl} sx={{borderRadius: '4px', backgroundColor: 'white'}}>
      <ClickAwayListener onClickAway={() => {openTicket(0)}}> 
      <Grid container width='440px' spacing={3} padding={2}>
         <Grid item xs={1}><ChatBubbleOutlineIcon /></Grid>
         <Grid item xs={11}><Typography textAlign='right' paddingRight={1}>
            Case Number: {selectedTicket.length !== 0 ? selectedTicket[0].caseno : ''}
         </Typography></Grid>
         <Grid item xs={12} height={chatHeight + 'px'} sx={{overflow: 'scroll', overflowX: 'hidden'}}>
            <Grid container direction='column' spacing={2}>{messages}</Grid>
         </Grid>
         <Grid item xs={12}><TextField fullWidth sx={{backgroundColor: 'secondary.main', borderRadius: '4px'}} 
         id='content' variant='outlined' label='Send Message' multiline></TextField></Grid>
      </Grid>
      </ClickAwayListener>
   </Popper>
);}
