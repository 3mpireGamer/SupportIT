import { createTheme } from '@mui/material/styles';
import { deepOrange } from '@mui/material/colors';
import { dark, light } from './theme';

export const elementWidth = 380

export function generateCaseNo(author) {
   return ('C-' + author[0] + Math.floor(Math.random() * 10000)
      + author[author.length - 1] + Math.floor(Math.random() * 10000)).toUpperCase()
}
export function generateId() {
   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let id = ''
   for (let i = 0; i < 20; i++) {
     id += chars.charAt(
       Math.floor(Math.random() * chars.length)
     )
   }
   return id
}
export function modTicket(ticket, username, messageContent) {
   let date = new Date();
   ticket.updated = date;
   if(messageContent) {ticket.messages.push({
      id: generateId(),
      author: username, 
      content: messageContent, 
      dateTime: date
   })}
   return ticket
}
export function canModTicket(authenticated, ticket) {
   return isAdminOrAuthor(authenticated, ticket.author) && !isClosed(ticket)
}
export function canDeleteMessage(authenticated, ticket, message) {
   return isRecentMessage(message) && isAdminOrAuthor(authenticated, message.author) && !isClosed(ticket)
}
const hour = 3600000;
function isRecentMessage(message) {
   return Date.now() - message.dateTime.getTime() < hour
}
function isAdminOrAuthor(authenticated, author) {
   return authenticated.isAdmin || authenticated.username === author
}
function isClosed(ticket) {
   return ticket.status === 'Closed'
}
export function parseMonth(month) {
   switch(month) {
      case 0: return 'Jan'
      case 1: return 'Feb'
      case 2: return 'Mar'
      case 3: return 'Apr'
      case 4: return 'May'
      case 5: return 'Jun'
      case 6: return 'Jul'
      case 7: return 'Aug'
      case 8: return 'Sep'
      case 9: return 'Oct'
      case 10: return 'Nov'
      case 11: return 'Dec'
      default: return ''
   }
}


export function getTheme(mode) {
   const isDarkMode = mode === 'dark';
   let selectedTheme = isDarkMode ? dark : light;
   return createTheme(selectedTheme, {
      palette: {
        background: {
            default: selectedTheme.palette.primary.light,
            paper: isDarkMode ? selectedTheme.palette.secondary.main : selectedTheme.palette.background.paper,
         }, 
         error: {
            light: deepOrange['500'], 
            main: deepOrange['800'], 
            dark: deepOrange['A700'], 
          },
      },
      components: {
         MuiAppBar: {
            styleOverrides: {
               colorPrimary: {
                  backgroundColor: selectedTheme.palette.secondary.dark
         }}},
      }
   }
)}
