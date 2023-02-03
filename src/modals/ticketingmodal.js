import React from 'react';

const ticketTemplate = {
   author: 'Luca', 
   title: '', 
   status: 'Open', 
   category: '--Select Category--',
   desc: '', 
   caseno: 0, 
   created: '1 January 2023',
   updated: '2 January 2023',
}

export class TicketingModal extends React.Component {
   state = {
      show: false, 
      isFilled: false,
      ticket: {...ticketTemplate}
   }

   onChange = (e) => {
      let ticket = {...this.state.ticket};
      ticket[e.target.id] = e.target.value;
      this.setState({
         ticket
      });
   }
   createTicket = (e) => {
      this.props.addTicket(this.state.ticket);
      this.hideModal();
   }
   showModal = (e) => {
      this.setState({show: true,});
   }
   hideModal = (e) => {
      this.setState({
         show: false, 
         isFilled: false,
         ticket: {...ticketTemplate}});
   }
   componentDidUpdate() {
      if (this.state.ticket.title!=='' && this.state.ticket.category!=='--Select Category--' && this.state.ticket.desc!=='' && !this.state.isFilled) {
         this.setState({isFilled: true,});
      } else if ((this.state.ticket.title==='' || this.state.ticket.category==='--Select Category--' || this.state.ticket.desc==='') && this.state.isFilled) {
         this.setState({isFilled: false,});
      };
   }
   render() {
      if (!this.state.show) {
         return (
         <button onClick={(e) => {this.showModal()}}>Create Ticket</button>);
      };
      return (
         <div>
            <TicketForm onChange={this.onChange}/>
            <button onClick={(e) => {this.hideModal()}}>Cancel</button>
            {this.state.isFilled ? (<button onClick={(e) => {this.createTicket();}}>Submit</button>) : (<button disabled>Submit</button>)}
         </div>
      );
   }
}

const TicketForm = ({ onChange }) => {
   return (
      <form id='TicketForm'>
         <label htmlFor='title'>Title</label> <br />
         <input id='title' type='text' onChange={onChange}></input> <br />
         <label htmlFor='category'>Category</label> <br />
         <select id='category' onChange={onChange}> 
            <option>--Select Category--</option>
            <option>Development</option>
            <option>Networking</option>
            <option>Software</option>
         </select> <br />
         <label htmlFor='desc'>Description</label> <br />
         <input id='desc' type='text' onChange={onChange}></input> <br />
      </form>
   )
}
