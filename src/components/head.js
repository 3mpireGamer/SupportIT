import React, { useCallback, useContext } from 'react';
import { Button, IconButton, Grid, Typography } from '@mui/material';
import { TicketingModal } from '../modals/ticketingmodal';
import { AuthContext, FirestoreContext } from '../app';
import { generateCaseNo, generateId } from "../utils";
import { addTicket } from './firebase';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export function Head({ authenticate, refresh, toggleRefresh }) {
   const authenticated = useContext(AuthContext);
   const fs = useContext(FirestoreContext);

   const newTicket = useCallback((ticket) => {
      ticket.author = authenticated.username;
      ticket.caseno = generateCaseNo(authenticated.username);
      ticket.created = new Date();
      ticket.updated = new Date();
      ticket.messages = [{
         id: generateId(),
         author: ticket.author, 
         content: 'Hello, I need help with ' + ticket.category + '. ' + ticket.desc,
         dateTime: new Date()
      }];
      addTicket(fs.collection, ticket);
      toggleRefresh(!refresh);
   }, [authenticated, fs.collection, refresh, toggleRefresh])

return (
   <Grid container spacing={2} pt={1} justifyContent='space-around'>
      <Grid item xs={2} textAlign='right'>
         {true ? <IconButton color='black'><DarkModeIcon fontSize='large' /></IconButton>
         : <IconButton color='white'><LightModeIcon fontSize='large' /></IconButton>}
      </Grid>
      <Grid item xs={8} textAlign='center'><Typography variant='h3'>SupportIT - Help Desk</Typography></Grid>
      <Grid item xs={2} textAlign='left'><Typography variant='h5'>{authenticated ? 'Hello, ' : ''}{authenticated.username}</Typography></Grid>
      <Grid item xs={2} />
      <Grid item xs={8} textAlign='center'>{authenticated ? <TicketingModal newTicket={newTicket} /> : <></>}</Grid>
      <Grid item xs={2} textAlign='left'>{authenticated ? <Button variant='outlined' color='error' onClick={() => {authenticate('')}}>Logout</Button> : <></>}</Grid>
   </Grid>
)}
