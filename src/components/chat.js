import React, { useContext, useEffect, useRef, useState } from 'react'
import { canModTicket, parseMonth } from '../utils';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CancelPresentationTwoToneIcon from '@mui/icons-material/CancelPresentationTwoTone';
import { Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { getChatHeight } from '../modals/chatmodal';
import { AuthContext } from '../app';

export function MessagingHead({ confirm, setConfirm, closeTicket, selectedTicket }) {
   const authenticated = useContext(AuthContext);
   return (
   <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} width='100%' backgroundColor='secondary.main' padding={1}
   sx={{borderTopLeftRadius: '4px', borderTopRightRadius: '4px'}}>
      <ChatBubbleOutlineIcon fontSize='large' />
      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
         {canModTicket(authenticated, selectedTicket) ? 
         <TicketCloser confirm={confirm} setConfirm={setConfirm} closeTicket={closeTicket} selectedTicket={selectedTicket} />
         : <Button variant='text' size='large'>Case {selectedTicket.caseno}</Button>}
   </Stack></Stack>
)}
function TicketCloser({ confirm, setConfirm, closeTicket, selectedTicket }) {
   return confirm ? <>
      <IconButton variant='text' color='error' onClick={() => {setConfirm(false)}}><CancelPresentationTwoToneIcon /></IconButton>
      <Button variant='text' size='large' onClick={() => {closeTicket(selectedTicket)}}>Close {selectedTicket.caseno}?</Button>
   </> : <Button variant='text' size='large' onClick={() => {setConfirm(true)}}>Case {selectedTicket.caseno}</Button>
}
export function Messages({ ticket }) {
   const authenticated = useContext(AuthContext);
   const latestMessage = useRef();
   useEffect(() => {
      if(latestMessage.current) {latestMessage.current.scrollIntoView()}
   }, [ticket])

   return (
   <Stack spacing={2} width='100%' height={getChatHeight() + 'px'} sx={{overflow: 'scroll', overflowX: 'hidden'}}>
   {ticket.messages.map(message => {
      return authenticated.username === message.author ? (
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
export function MessageBox({ handleNewMessage, selectedTicket }) {
   const [label, setLabel] = useState('Send Message');
   return <Box padding={1} width='100%' backgroundColor='secondary.main'> {
      selectedTicket.status !== 'Closed' ? (
      <TextField id='content' variant='outlined' label={label}
         fullWidth multiline maxRows={3} minRows={3}
         sx={{backgroundColor: 'white', borderRadius: '4px'}} 
         onKeyDown={(e) => {if (e.key === 'Enter') {handleNewMessage(selectedTicket, e)}}}
         onFocus={() => {setLabel('Press Enter to Send Message')}} onBlur={() => {setLabel('Send Message')}}
      /> ) : <Typography fullWidth textAlign='center' variant='h6'>This Ticket is Closed</Typography>
   } </Box>
}

function formatDate(date) {
   return parseMonth(date.getMonth()) + ' ' + date.getDate() + ' - ' + date.getHours() + ':' + date.getMinutes()
}
