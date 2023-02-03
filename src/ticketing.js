import React from 'react';
import { TicketingModal } from './modals/ticketingmodal';

/*
{
   author: 'Luca', 
   title: 'Test', 
   status: 'Open', 
   category: 'Development',
   desc: 'Dev Test', 
   caseno: 1, 
   created: '1 January 2023',
   updated: '2 January 2023',
}
*/

export class Ticketing extends React.Component {
   state = {
      tickets: []};
   addTicket = (ticket) => {
      ticket.caseno = this.state.tickets.length + 1
      this.setState({
         tickets: this.state.tickets.concat([ticket]),
      });
   }
   render() {
      return (
      <div>
         <TicketingModal addTicket={this.addTicket} />
         <br /><br />
         <TicketList tickets={this.state.tickets} />
      </div>
   );}
}

const TicketList = ({ tickets }) => {
   const ticketsList = tickets.map(ticket => {
      return (
      <div key={ticket.caseno}>
         <p>Author: {ticket.author}</p>
         <p>Title: {ticket.title}</p>
         <p>Status: {ticket.status}</p>
         <p>Category: {ticket.category}</p>
         <p>Description: {ticket.desc}</p>
         <p>Case Number: {ticket.caseno}</p>
         <p>Created on: {ticket.created}</p>
         <p>Updated on: {ticket.updated}</p> <br />
      </div>
   )});
   return (<div>{ticketsList}</div>)
}
