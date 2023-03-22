import React, { useState } from 'react';
import { Button, Box, ButtonGroup, InputLabel, NativeSelect, TextField, Popper, ClickAwayListener, Stack } from '@mui/material';
import CancelPresentationTwoToneIcon from '@mui/icons-material/CancelPresentationTwoTone';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const ticketTemplate = {
   author: '', 
   title: '', 
   status: 'Open', 
   category: '',
   desc: '', 
   caseno: '', 
   created: Date(),
   updated: Date(),
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
      setFilled(false);
   }
   return (<>
      <Button variant='contained' color='primary' onClick={() => {showModal()}}>Create Ticket</Button>
      <Box id='modalAnchor' pt={1} />
      <Popper open={show} anchorEl={anchorEl} sx={{backgroundColor: 'secondary.dark', borderRadius: '4px'}}><ClickAwayListener onClickAway={hideModal}>
         <Stack p={1} spacing={1} alignItems='center' justifyContent='space-around' sx={{ border: 1, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: '8px', padding: '8px'}}>
            <TicketForm onChange={onChange}/>
            <FormButtons hideModal={hideModal} createTicket={createTicket} isFilled={isFilled}/>
         </Stack>
      </ClickAwayListener></Popper>
</>)}

const TicketForm = ({ onChange }) => {  
   return (
   <Stack spacing={1.5}>
      <TextField fullWidth id='title' variant='outlined' label='Case Title' onChange={onChange} sx={{backgroundColor: 'secondary.light', borderRadius: '4px'}} />
      <Box sx={{ border: 1, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: 'secondary.light'}}>
         <InputLabel sx={{padding: '8px 8px 0 8px'}} variant='standard' htmlFor='category'>Category</InputLabel>
         <NativeSelect sx={{padding: '0 8px 8px 8px'}} fullWidth id='category' defaultValue={'Select Category'} onChange={onChange}> 
            <option hidden>Select Category</option>
            <option>Accounts</option>
            <option>Development</option>
            <option>Hardware</option>
            <option>Human Resources</option>
            <option>Networking</option>
            <option>Software</option>
            <option>Other</option>
         </NativeSelect> 
      </Box>
      <TextField fullWidth id='desc' variant='outlined' label='Brief Description...' multiline onChange={onChange} sx={{backgroundColor: 'secondary.light', borderRadius: '4px'}} />
   </Stack>
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
