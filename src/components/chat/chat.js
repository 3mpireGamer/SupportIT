import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { canDeleteMessage, canModTicket, parseMonth } from '../../utils/utils';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, Button, ButtonGroup, Card, CardContent, CardHeader, ClickAwayListener, Grid, IconButton, Popper, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { AuthContext, FirestoreContext } from '../../app';
import { updateTicket } from '../../utils/firebase';

export function MessagingHead({ closeModal, ticketCloser, selectedTicket }) {
   const authenticated = useContext(AuthContext);

   return <CardHeader id='confirmAnchor'
      avatar={<ChatBubbleOutlineIcon fontSize='large' />}
      title={selectedTicket.title} 
      subheader={'Case ' + selectedTicket.caseno}
      action={<Stack><IconButton onClick={closeModal} size='small'><ClearIcon fontSize='small' /></IconButton>
      {canModTicket(authenticated, selectedTicket) ? <TicketCloser ticketCloser={ticketCloser} ticket={selectedTicket} /> : <></>}</Stack>}
      titleTypographyProps={{align: 'right', sx: {fontWeight: 'bold'}}}
      subheaderTypographyProps={{align: 'right', sx:{paddingTop: 1.25}}}
      sx={{backgroundColor: 'secondary.main', width: '100%'}}
   />
}
function TicketCloser({ ticketCloser, ticket }) {
   const [confirmClose, setConfirmClose] = useState(false);
   return (<>
   <IconButton onClick={() => setConfirmClose(true)} size='small'>
      <MoreVertIcon fontSize='small' />
   </IconButton>
   <Popper open={confirmClose} anchorEl={document.getElementById('confirmAnchor')} placement='bottom-end'>
   <ClickAwayListener onClickAway={() => setConfirmClose(false)}>
      <Stack direction='row' sx={{padding: 2, backgroundColor: 'secondary.light'}}>
         <Button variant='contained' disableElevation color='error' onClick={() => {ticketCloser(ticket); setConfirmClose(false)}}>Close {ticket.caseno}?</Button>
         <IconButton size='small' onClick={() => setConfirmClose(false)}><ClearIcon /></IconButton>
      </Stack>
   </ClickAwayListener></Popper>
</>)}


const chatHeight = 400;
export function Messages({ ticket }) {
   const authenticated = useContext(AuthContext);
   const fs = useContext(FirestoreContext);
   const latestMessage = useRef();
   useEffect(() => {
      latestMessage.current?.scrollIntoView({block: 'end'});
   }, [ticket])
   
   const deleteMessage = useCallback((id) => {
      ticket.updated = new Date();
      ticket.messages = ticket.messages.filter((message) => {
         return message.id !== id
      });
      updateTicket(fs.db, ticket);
   }, [fs.db, ticket]);

   return (
   <Stack spacing={2} width='100%' height={chatHeight + 'px'} sx={{overflow: 'scroll', overflowX: 'hidden'}} p={1}>
      {ticket.messages.map(message => {
         return <Grid ref={latestMessage} key={message.id} container>
         {(authenticated.username === message.author) ? (<>
            <Grid item xs={2} /><Grid item xs={10}>
               <Message message={message} deleteMessage={deleteMessage} align={'right'} canDeleteMessage={() => canDeleteMessage(authenticated, ticket, message)} />
            </Grid>
         </>
         ) : (<>
            <Grid item xs={10}>
               <Message message={message} deleteMessage={deleteMessage} align={'right'} canDeleteMessage={() => canDeleteMessage(authenticated, ticket, message)} />
            </Grid><Grid item xs={2} />
         </>
      )}</Grid>
      })}
   </Stack>
)}
function Message({ message, deleteMessage, align, canDeleteMessage }) {
   const [confirmDelete, setConfirmDelete] = useState(false);

   return (
   <Card elevation={10}>
      <CardHeader 
         title={message.author} 
         subheader={formatDate(message.dateTime)}
         action={canDeleteMessage() ?
            confirmDelete ? <ButtonGroup size='small' onClick={() => setConfirmDelete(!confirmDelete)}>
               <IconButton onClick={() => deleteMessage(message.id)} color='error'><DeleteIcon/></IconButton>
               <IconButton ><ClearIcon /></IconButton>
            </ButtonGroup>
            : <IconButton onClick={() => setConfirmDelete(!confirmDelete)} disableTouchRipple><MoreVertIcon /> </IconButton>
         : <></>}
         titleTypographyProps={{variant: 'body1', sx: {fontWeight: 'bold'}}}
         subheaderTypographyProps={{variant: 'body2'}}
      />
      <CardContent sx={{paddingTop: '0px'}}>
         <Typography align={align}>{message.content}</Typography>
      </CardContent>
   </Card>
)}

export function MessageBox({ handleNewMessage, selectedTicket }) {
   const [label, setLabel] = useState('Send Message');
   return <Box padding={1} width='100%' backgroundColor='secondary.main'> {
      selectedTicket.status !== 'Closed' ? (
      <TextField id='content' variant='outlined' label={label}
         fullWidth multiline maxRows={3} minRows={3}
         sx={{backgroundColor: 'secondary.light', borderRadius: 1}} 
         onKeyDown={(e) => {if (e.key === 'Enter') {handleNewMessage(selectedTicket, e)}}}
         onFocus={() => {setLabel('Press Enter to Send Message')}} onBlur={() => {setLabel('Send Message')}}
      /> ) : <Typography textAlign='center' variant='h6'>This Ticket is Closed</Typography>
   } </Box>
}

function formatDate(date) {
   return parseMonth(date.getMonth()) + ' ' + date.getDate() + ' - ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
}
