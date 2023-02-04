import { Grid, Typography } from '@mui/material';
import React from 'react';
import { TicketingModal } from './modals/ticketingmodal';

export class Ticketing extends React.Component {
   state = {
      tickets: [
         {author: 'Luca', 
          title: 'Test', 
          status: 'Open', 
          category: 'Development',
          desc: 'This is a development test of the ticketing display grid. We can make the grid even bigger, wow!', 
          caseno: 1, 
          created: '1 January 2023',
          updated: '2 January 2023',}
      ]};
   addTicket = (ticket) => {
      ticket.caseno = this.state.tickets.length + 1
      this.setState({
         tickets: this.state.tickets.concat([ticket]),
      });
   }
   render() { //Need Grid with Mutiple breakpoints for window resizing and small displays
      return ( 
      <Grid container direction='column' alignItems='center' spacing={4}>
         <Grid item xs={12}><TicketingModal addTicket={this.addTicket} /></Grid>
         <Grid item xs={12}>
            <Grid container direction='column' alignItems='center' spacing={2} marginTop='0'>
               <TicketList tickets={this.state.tickets} />
         </Grid></Grid>
      </Grid>
   );}
}

const TicketList = ({ tickets }) => {
   const ticketsList = tickets.map(ticket => {
      return (
      <Grid item xs={12} key={ticket.caseno} paddingTop={1} paddingLeft={1}>
         <Grid container direction='row' maxWidth='960px'>
            <Grid item sx={{textAlign: 'left'}} xs={3}>
            <Typography>Case Number: {ticket.caseno}</Typography></Grid>
            <Grid item sx={{textAlign: 'left'}} xs={3}>
            <Typography>{ticket.author} | {ticket.title}</Typography></Grid>
            <Grid item sx={{textAlign: 'right'}} xs={3}>
            <Typography>Status: {ticket.status}</Typography></Grid>
            <Grid item sx={{textAlign: 'right'}} xs={3}>
            <Typography>Updated</Typography></Grid>
            <Grid item sx={{textAlign: 'left'}} xs={3}>
            <Typography>Description</Typography></Grid>
            <Grid item sx={{textAlign: 'left'}} xs={6}>
            <Typography noWrap>{ticket.desc}</Typography></Grid>
            <Grid item sx={{textAlign: 'right'}} xs={3}>
            <Typography>{ticket.updated}</Typography></Grid>
      </Grid></Grid>
   )});
   return (<div>{ticketsList}</div>)
}

/*<p>Author: {ticket.author} Title: {ticket.title}</p>
<p>Status: {ticket.status} Category: {ticket.category}</p>
<p>Description: {ticket.desc} Case Number: {ticket.caseno}</p>
<p>Created on: {ticket.created} Updated on: {ticket.updated}</p> <br />*/