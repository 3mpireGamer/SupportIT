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
export function getDocValues() {
   return [
      document.getElementById('head').offsetHeight, 
      document.getElementById('root').offsetHeight, 
      document.getElementById('root').offsetWidth, 
      window.scrollY
   ]
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
   return ((authenticated.isAdmin || authenticated.username === ticket.author) && ticket.status !== 'Closed')
}
export function canDeleteMessage(authenticated, ticket) {
   return authenticated.isAdmin && ticket.status !== 'Closed'
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
