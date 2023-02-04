import React from 'react';
import { Grid, Typography } from '@mui/material';
import { TicketingModal } from '../modals/ticketingmodal';

export function Head({ addTicket }) {
   return (
      <Grid container direction='column' spacing={3} alignContent='center'>
         <Grid item xs={12}><Typography variant='h2'>SupportIT - Help Desk</Typography></Grid>
         <Grid item xs={12}><TicketingModal addTicket={addTicket} /></Grid>
      </Grid>
)}