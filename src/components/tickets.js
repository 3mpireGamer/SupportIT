import React, { useState } from 'react';
import { Avatar, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Collapse, Stack, Typography } from '@mui/material';
import { elementWidth, parseMonth } from '../utils';

export function Tickets ({ tickets, openTicket }) {
   return tickets.map(ticket => {
      return <Ticket key={ticket.id} ticket={ticket} openTicket={openTicket} />
   });
}

const maxDescLength = 150;
function Ticket({ ticket, openTicket }) {
   const [expand, toggleExpand] = useState(false);

   let desc = ticket.desc.slice(0, maxDescLength)
   return (<Card elevation={5} sx={{width: elementWidth + 'px'}}>
      <CardActionArea onClick={() => {openTicket(ticket.id)}}>
         <CardHeader 
            avatar={<Avatar sx={{color: '#000', backgroundColor: '#bdbdbd'}}>{ticket.author.charAt(0)}</Avatar>}
            title={ticket.title} 
            subheader={
               ticket.caseno + ' last updated ' + formatDate(ticket.updated)
            }
         />
      </CardActionArea>
      <Collapse in={expand} timeout='auto' unmountOnExit><CardContent>
         <Typography variant='h6'>Category: {ticket.category}</Typography>
         <Typography variant='body1' paragraph>{desc} {desc.length < ticket.desc.length ? '...' : ''}</Typography>
         <Typography variant='caption'>{ticket.author} created on {formatDate(ticket.created, true)}.</Typography>
      </CardContent></Collapse>
      <CardActions>
         <Stack direction='row' pl={7} pr={2} justifyContent='space-between' width='100%'>
         <Button onClick={() => (toggleExpand(!expand))}>Show {expand ? 'less' : 'more'}...</Button>
         <Button onClick={() => {openTicket(ticket.id)}}>View ticket</Button>
         </Stack>
      </CardActions>
   </Card>
)}

// Values in milliseconds
const minute = 60000;
const hour = 3600000;
const day = 86400000;
const week = 604800000;
function formatDate(date, detailed=false) {
   let detailedDate = parseMonth(date.getMonth()) + ' ' + date.getDate() + ' ' + date.getFullYear()
   if (detailed) return detailedDate
   let timePassed = Date.now() - date.getTime();
   if (timePassed < minute) return 'seconds ago'
   if (timePassed < hour) {
      let minutesPassed = Math.floor(timePassed/minute)
      return minutesPassed + (minutesPassed === 1 ? ' min' : ' mins') + ' ago'
   }
   if (timePassed < day) {
      let hoursPassed = Math.floor(timePassed/hour)
      return hoursPassed + (hoursPassed === 1 ? ' hr' : ' hrs') + ' ago'
   }
   if (timePassed < week) {
      let daysPassed = Math.floor(timePassed/day)
      return daysPassed + (daysPassed === 1 ? ' day' : ' days') + ' ago'
   }
   return detailedDate
}
