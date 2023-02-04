import React from 'react';
import { Button, Box, ButtonGroup, Grid, InputLabel, NativeSelect, TextField, Typography } from '@mui/material';
import CancelPresentationTwoToneIcon from '@mui/icons-material/CancelPresentationTwoTone';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const ticketTemplate = {
   author: 'Luca', 
   title: '', 
   status: 'Open', 
   category: '',
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
   componentDidUpdate() { //useEffect to only listen to this.state.ticket?
      if (this.state.ticket.title!=='' && this.state.ticket.category!=='' && this.state.ticket.desc!=='' && !this.state.isFilled) {
         this.setState({isFilled: true,});
      } else if ((this.state.ticket.title==='' || this.state.ticket.category==='' || this.state.ticket.desc==='') && this.state.isFilled) {
         this.setState({isFilled: false,});
      };
   }
   render() {
      if (!this.state.show) {
         return (
         <Button variant='contained' color='primary' onClick={() => {this.showModal()}}>Create Ticket</Button>
      );};
      return (
      <Grid container spacing={2} maxWidth='480px'>
         <Grid item xs={12}><TicketForm onChange={this.onChange}/></Grid>
         <Grid item xs={12}>
            <FormButtons hideModal={this.hideModal} createTicket={this.createTicket} isFilled={this.state.isFilled}/>
         </Grid>
      </Grid>
      );
   }
}

const TicketForm = ({ onChange }) => {  
   return (
   <Grid container spacing={1}>
      <Grid item xs={12}><Typography textAlign='center' variant='h4'>Create a New Ticket</Typography></Grid>
      <Grid item xs={12}><TextField fullWidth id='title' variant='outlined' label='Case Title' onChange={onChange}></TextField></Grid>
      <Grid item xs={12}>
         <Box sx={{ border: 1, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: '4px', boxSizing: 'border-box'}}>
            <InputLabel sx={{padding: '8px 8px 0 8px'}} variant='standard' htmlFor='category'>Category</InputLabel>
            <NativeSelect sx={{padding: '0 8px 8px 8px'}} fullWidth id='category' defaultValue={'Select Category'} onChange={onChange}> 
               <option hidden>Select Category</option>
               <option>Development</option>
               <option>Networking</option>
               <option>Software</option>
            </NativeSelect> 
         </Box>
      </Grid>
      <Grid item xs={12}><TextField fullWidth id='desc' variant='outlined' label='Brief Description...' multiline onChange={onChange}></TextField></Grid>
   </Grid>
)}

const FormButtons = ({ hideModal, createTicket, isFilled }) => {
   return (
   <ButtonGroup variant='contained' fullWidth>
      <Button color='error' startIcon={<CancelPresentationTwoToneIcon />}
      onClick={() => {hideModal()}}>Cancel</Button>
      {isFilled
      ? (<Button color='primary' endIcon={<DoneAllIcon />}
      onClick={() => {createTicket()}}>Submit</Button>)
      : (<Button disabled>Submit</Button>)}
   </ButtonGroup>
)}
