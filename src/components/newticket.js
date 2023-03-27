import React, { useState } from 'react';
import { Button, Box, ButtonGroup, InputLabel, NativeSelect, TextField, Popper, ClickAwayListener, Stack, InputAdornment } from '@mui/material';
import CancelPresentationTwoToneIcon from '@mui/icons-material/CancelPresentationTwoTone';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { elementWidth } from '../utils/utils';

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

const maxTitleLength = 30
export function NewTicket({ newTicket }) {
   const [isFilled, setFilled] = useState(false);
   const [charsLeft, setCharsLeft] = useState(maxTitleLength);
   const [show, setShow] = useState(false);
   const anchorEl = document.getElementById('modalAnchor')
   
   const onChange = (e) => {
      const [id, value] = [e.target.id, e.target.value];
      if (id === 'title') {
         ticket[id] = value.slice(0, maxTitleLength);
         document.getElementById('title').value = ticket.title;
         setCharsLeft(maxTitleLength - ticket.title.length)
      } else {
         ticket[id] = value;
      } 
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
      setCharsLeft(maxTitleLength);
   }
   return (<>
      <Button variant='contained' color='primary' onClick={() => {showModal()}}>Create Ticket</Button>
      <Box id='modalAnchor' pt={1} />
      <Popper open={show} anchorEl={anchorEl} sx={{backgroundColor: 'secondary.dark', borderRadius: 1}}>
      <ClickAwayListener onClickAway={hideModal}>
         <Stack p={1} spacing={1} alignItems='center' justifyContent='space-around' sx={{ border: 1, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: 2, padding: 2}} >
            <TicketForm onChange={onChange} charsLeft={charsLeft} />
            <FormButtons hideModal={hideModal} createTicket={createTicket} isFilled={isFilled}/>
         </Stack>
      </ClickAwayListener></Popper>
</>)}

const TicketForm = ({ onChange, charsLeft }) => {  
   return (
   <Stack spacing={1.5} width={elementWidth + 'px'}>
      <TextField fullWidth id='title' variant='outlined' label='Case Title'
         onChange={onChange} sx={{backgroundColor: 'secondary.light', borderRadius: 1}} 
         InputProps={{endAdornment: <InputAdornment position='end'>{charsLeft + '/' + maxTitleLength}</InputAdornment>}}
      />
      <Box sx={{ border: 1, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: 1, boxSizing: 'border-box', backgroundColor: 'secondary.light'}}>
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
