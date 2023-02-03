import React from 'react';
import Button from '@mui/material/Button'
import { ButtonGroup, Container } from '@mui/material';
import CancelPresentationTwoToneIcon from '@mui/icons-material/CancelPresentationTwoTone';
import DoneAllIcon from '@mui/icons-material/DoneAll';

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
   createTicket = () => {
      this.props.addTicket(this.state.ticket);
      this.hideModal();
   }
   showModal = () => {
      this.setState({show: true,});
   }
   hideModal = () => {
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
         <Button variant='outlined' onClick={() => {this.showModal()}}>Create Ticket</Button>);
      };
      return (
         <Container>
            <TicketForm onChange={this.onChange}/>
            <ButtonGroup variant='contained'>
               <Button color='error' startIcon={<CancelPresentationTwoToneIcon />}
               onClick={() => {this.hideModal()}}>Cancel</Button>
               {this.state.isFilled
               ? (<Button color='primary' endIcon={<DoneAllIcon />}
                 onClick={() => {this.createTicket();}}>Submit</Button>)
               : (<Button color='primary' disabled>Submit</Button>)}
            </ButtonGroup>
         </Container>
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
