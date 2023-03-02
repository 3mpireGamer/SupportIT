import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { TicketingModal } from '../modals/ticketingmodal';

export function Head({ newTicket, authenticated, authenticate }) {
   authenticated = authenticated.charAt(0).toUpperCase() + authenticated.slice(1);
   return (
      <Grid container direction='column' spacing={2} alignContent='center'>
         <Grid item xs={12} width='100%'><Grid container direction='row' spacing={1} alignContent='center'>
            <Grid item xs={1}></Grid>
            <Grid item xs={10}><Typography variant='h3' textAlign='center'>SupportIT - Help Desk</Typography></Grid>
            <Grid item xs={1}><Typography variant='h5' textAlign='left'><br />{authenticated}</Typography></Grid>
         </Grid></Grid>
         <Grid item xs={12} width='100%'><Grid container direction='row' spacing={1} alignContent='center'>
            <Grid item xs={1}></Grid>
            {authenticated ? <Grid item xs={10}><TicketingModal newTicket={newTicket} /></Grid> : null}
            {authenticated ? <Grid item xs={1}><Button variant='outlined' color='error' onClick={() => {authenticate('')}}>Logout</Button></Grid> : null}
         </Grid></Grid>
      </Grid>
)}