import React from "react";
import { Grid } from "@mui/material";
import { Ticketing } from "./components/ticketing";
import { Head } from "./components/head";


export class App extends React.Component {
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
   render() {
      return (
      <Grid container direction='column' spacing={4} alignContent='center'>
         <Grid item xs={12}><Head addTicket={this.addTicket}/></Grid>
         <Grid item xs={12}><Ticketing tickets={this.state.tickets}/></Grid>
      </Grid>
   )}
}
