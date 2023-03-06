import { initializeApp } from 'firebase/app';
import { addDoc, collection, doc, getFirestore, orderBy, query, updateDoc, where } from 'firebase/firestore';

export function firestoreInit() {
   const firebaseConfig = {
      apiKey: "AIzaSyC7Loi9_eiajp7-E5JP1LPCFRzbfHY4sag",
      authDomain: "support-ticketing-manager.firebaseapp.com",
      projectId: "support-ticketing-manager",
      storageBucket: "support-ticketing-manager.appspot.com",
      messagingSenderId: "403186507043",
      appId: "1:403186507043:web:da892e3c03554157438096"
   }
   
   initializeApp(firebaseConfig);
   let db = getFirestore();
   let ticketCollection = collection(db, 'tickets')
   return {
      db,
      collection: ticketCollection, 
      query: query(ticketCollection, where('updated', 'not-in', ['']), orderBy('updated', 'desc'))
   }
}


export function getLiveTickets(snapshot, filter) {
   let tickets = [];
   let ticketsPromise = new Promise((resolve) => {   
   snapshot.docs.forEach(ticket => {
      let temp = {...ticket.data()}
      temp.created = temp.created.toDate();
      temp.updated = temp.updated.toDate();
      temp.messages.forEach(message => {
         message.dateTime = message.dateTime.toDate();
      });
      tickets.push({
         ...temp, 
         id: ticket.id,
      }); 
   });
   if(filter) { switch(filter) {
      case 'Closed':
         tickets = tickets.filter(ticket => {
            return ticket.status === 'Closed'
         });
         break;
      default: 
         tickets = tickets.filter(ticket => {
            return ticket.author === filter && ticket.status !== 'Closed'
         });
   }} else {
      tickets = tickets.filter(ticket => {
         return ticket.status !== 'Closed'
      });
   }
   resolve(tickets);
   });
   return ticketsPromise
} 

export function addTicket(ticketCollection, ticket) {
   addDoc(ticketCollection, ticket)
}
export function updateTicket(db, ticket) {
   updateDoc(doc(db, 'tickets', ticket.id), ticket);
}
