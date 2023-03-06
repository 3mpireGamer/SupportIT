import React, { useCallback, useContext } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { TicketingModal } from '../modals/ticketingmodal';
import { AuthContext, FirestoreContext } from '../app';
import { generateCaseNo, generateId } from "./utils";
import { addTicket } from './firebase/firebase';

export function Head({ authenticate }) {
   const authenticated = useContext(AuthContext);
   const fs = useContext(FirestoreContext);

   const newTicket = useCallback((ticket) => {
      ticket.author = authenticated;
      ticket.caseno = generateCaseNo(authenticated);
      ticket.created = new Date();
      ticket.updated = new Date();
      ticket.messages = [{
         id: generateId(),
         author: ticket.author, 
         content: 'Hello, I need help with ' + ticket.category + '. ' + ticket.desc,
         dateTime: new Date()
      }];
      addTicket(fs.collection, ticket);
   }, [authenticated, fs.collection])

   return (
      <Grid container direction='column' spacing={2} alignContent='center'>
         <Grid item xs={12} width='100%'><Grid container direction='row' spacing={1} alignContent='center'>
            <Grid item xs={3}></Grid>
            <Grid item xs={6}><Typography variant='h3' textAlign='center'>SupportIT - Help Desk</Typography></Grid>
            <Grid item xs={3}><Typography variant='h5' textAlign='left'><br />{authenticated}</Typography></Grid>
         </Grid></Grid>
         <Grid item xs={12} width='100%'><Grid container direction='row' spacing={1} alignContent='center'>
            <Grid item xs={3}></Grid>
            {authenticated ? <Grid item xs={6}><TicketingModal newTicket={newTicket} /></Grid> : null}
            {authenticated ? <Grid item xs={3}><Button variant='outlined' color='error' onClick={() => {authenticate('')}}>Logout</Button></Grid> : null}
         </Grid></Grid>
      </Grid>
)}
