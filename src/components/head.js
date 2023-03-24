import React, { useCallback, useContext } from 'react';
import { Button, IconButton, Grid, Typography } from '@mui/material';
import { TicketingModal } from '../modals/ticketingmodal';
import { AuthContext, FirestoreContext, RefreshContext } from '../app';
import { generateCaseNo, generateId } from "../utils";
import { addTicket } from './firebase';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export function Head({ authenticate, mode, setMode }) {
   const toggleRefresh = useContext(RefreshContext);
   const authenticated = useContext(AuthContext);
   const fs = useContext(FirestoreContext);
   const isDarkMode = mode === 'dark'

   const newTicket = useCallback((ticket) => {
      let date = new Date();
      ticket.author = authenticated.username;
      ticket.caseno = generateCaseNo(authenticated.username);
      ticket.created = date;
      ticket.updated = date;
      ticket.messages = [{
         id: generateId(),
         author: ticket.author, 
         content: 'Hello, I need help with ' + ticket.category + '. \n' + ticket.desc,
         dateTime: date,
      }];
      addTicket(fs.collection, ticket);
      toggleRefresh();
   }, [authenticated, fs.collection, toggleRefresh])

return (
   <Grid container spacing={1} pt={1} pb={1} justifyContent='space-around'>
      <Grid item xs={3} textAlign='right' mt={1}>
         <IconButton color='black' onClick={() => {
            setMode(isDarkMode ? 'light' : 'dark')
         }}>{isDarkMode ? 
            <LightModeIcon fontSize='large' /> : <DarkModeIcon fontSize='large' />
         }</IconButton>
      </Grid>
      <Grid item xs={6} textAlign='center'><Typography variant='h3'>SupportIT - Help Desk</Typography></Grid>
      <Grid item xs={3} textAlign='left' mt={3}><Typography variant='h5'>{authenticated ? 'Hello, ' : ''}{authenticated.username}</Typography></Grid>
      <Grid item xs={3} />
      <Grid item xs={6} textAlign='center'>{authenticated ? <TicketingModal newTicket={newTicket} /> : <></>}</Grid>
      <Grid item xs={3} textAlign='left'>{authenticated ? <Button variant='outlined' color='error' onClick={() => {authenticate('')}}>Logout</Button> : <></>}</Grid>
   </Grid>
)}
