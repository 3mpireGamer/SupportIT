import React from 'react';

export class Ticketing extends React.Component {
   ticket = {
      author: 'Luca', 
      title: 'Test Ticket', 
      category: 'Development',
      desc: 'Development Ticket Test', 
      caseno: 1, 
      created: '1 January 2023',
      updated: '2 January 2023',
   }
   render() {
      return(
      <div>
         Author: {this.ticket.author} <br />
         Title: {this.ticket.title} <br />
         Category: {this.ticket.category} <br />
         Description: {this.ticket.desc} <br />
         Case Number: {this.ticket.caseno} <br />
         Created on: {this.ticket.created} <br />
         Updated on: ``{this.ticket.updated} <br />
      </div>
   )}
}
