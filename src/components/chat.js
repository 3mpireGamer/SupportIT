import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../app';
import { Box,  Grid, Typography } from '@mui/material';
import { parseMonth } from './utils';


const modalHeight = 34;
const chatHeight = 400;
export function getChatHeight() { return chatHeight }

export function doesChatFit(headHeight, docHeight) {
   return docHeight > (chatHeight + modalHeight + headHeight)
}
export function generateBoundingRect() {
   let [headHeight, docHeight, docWidth, scrollY] = getDocValues();
   let chatFits = doesChatFit(headHeight, docHeight);
   let boundingClientRect = () => ({
      width: '0', height: '0', left: docWidth,
      top: chatFits 
      ? docHeight : scrollY <= (16 + headHeight) 
      ? 16 + headHeight - scrollY : scrollY <= (chatHeight + modalHeight + headHeight - docHeight) 
      ? 16 + headHeight - scrollY : docHeight
   })
   let placementBool = chatFits 
   ? true : scrollY <= (16 + headHeight) 
   ? false : scrollY <= (chatHeight + modalHeight + headHeight - docHeight) 
   ? false : true
   return ({boundingClientRect, placementBool})
}

export function Chat({ ticket }) {
   const authenticated = useContext(AuthContext);
   useEffect(() => {
      document.getElementById(ticket.messages[ticket.messages.length-1].id).scrollIntoView();
   }, [ticket])

   return (ticket.messages.map(message => {
      return authenticated === message.author
      ? (<Grid item id={message.id} key={message.id}><Grid container>
      <Grid item xs={2}></Grid>
      <Grid item xs={10}>
         <Box sx={{ border: 1, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: '8px', padding: '8px'}}>
            <Typography textAlign='right' fontWeight='bold'>{formatDate(message.dateTime)} | {message.author}</Typography>
            <Typography textAlign='right'>{message.content}</Typography>
         </Box>
      </Grid></Grid></Grid>)
      : (<Grid item id={message.id} key={message.id}><Grid container>
      <Grid item xs={10}>
         <Box sx={{ border: 1, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: '8px', padding: '8px'}}>
            <Typography textAlign='left' fontWeight='bold'>{message.author} | {formatDate(message.dateTime)}</Typography>
            <Typography textAlign='left'>{message.content}</Typography>
         </Box>
      </Grid><Grid item xs={2}></Grid>
      </Grid></Grid>)
   }));
}


function getDocValues() {
   return [
      document.getElementById('head').offsetHeight, 
      document.getElementById('root').offsetHeight, 
      document.getElementById('root').offsetWidth, 
      window.scrollY
   ]
}
function formatDate(date) {
   return parseMonth(date.getMonth()) + ' ' + date.getDate() + ' - ' + date.getHours() + ':' + date.getMinutes()
}
