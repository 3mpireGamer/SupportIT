import React, { useState } from 'react';
import { Button, Box, ButtonGroup, Grid, InputLabel, NativeSelect, TextField, Popper, ClickAwayListener } from '@mui/material';
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
   messages: [{}]
} 
let ticket = {...ticketTemplate}

export function TicketingModal({ newTicket }) {
   const [isFilled, setFilled] = useState(false);
   const [show, setShow] = useState(false);
   const anchorEl = document.getElementById('modalAnchor')
   
   const onChange = (e) => {
      ticket[e.target.id] = e.target.value;
      if (ticket.title!=='' && ticket.category!=='' && ticket.desc!=='' && !isFilled) {
         setFilled(true);
      } else if ((ticket.title==='' || ticket.category==='' || ticket.desc==='') && isFilled) {
         setFilled(false);
      }
   }
   const createTicket = () => {
      newTicket(ticket);
      hideModal();
   }
   const showModal = () => {
      setShow(true);
   }
   const hideModal = () => {
      ticket = {...ticketTemplate}
      setShow(false);
   }
   return (
   <Grid container direction='column' alignContent='center' spacing={2}>
      <Grid item xs={12}>
         <Button variant='contained' color='primary'
         onClick={() => {showModal()}}>Create Ticket</Button>
      </Grid><Grid item id='modalAnchor'></Grid>
      <Popper open={show} anchorEl={anchorEl} sx={{backgroundColor: 'secondary.light', borderRadius: '4px'}}>
         <ClickAwayListener onClickAway={hideModal}>
            <Grid container spacing={1} alignContent='center'>
               <Grid item xs={12}><TicketForm onChange={onChange}/></Grid>
               <Grid item xs={12}><FormButtons hideModal={hideModal} createTicket={createTicket} isFilled={isFilled}/></Grid>
            </Grid>
         </ClickAwayListener>
      </Popper>
   </Grid>
);}

const TicketForm = ({ onChange }) => {  
   return (
   <Grid container spacing={1.5}>
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
