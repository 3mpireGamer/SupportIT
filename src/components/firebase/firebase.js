import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

export function firebaseInit() {
   const firebaseConfig = {
      apiKey: "AIzaSyC7Loi9_eiajp7-E5JP1LPCFRzbfHY4sag",
      authDomain: "support-ticketing-manager.firebaseapp.com",
      projectId: "support-ticketing-manager",
      storageBucket: "support-ticketing-manager.appspot.com",
      messagingSenderId: "403186507043",
      appId: "1:403186507043:web:da892e3c03554157438096"
   }
   
   initializeApp(firebaseConfig);
   const db = getFirestore();
   return getTickets(db)
}

function getTickets(db) {
   const ticketCollection = collection(db, 'tickets');
   let tickets = [];
   getDocs(ticketCollection)
      .then((snapshot) => {
         snapshot.docs.forEach(ticket => {
            tickets.push({
               ...ticket.data(), 
               messages: getMessages(db, ticket),
               id: ticket.id,
            });    
         });
      })
      .catch(err => {
         console.log(err.message);
      });
   return tickets
} function getMessages(db, ticket) {
   const messageCollection = collection(db, 'tickets/' + ticket.id + '/messages');
   let messages = [];
   getDocs(messageCollection)
      .then((snapshot) => {
         snapshot.docs.forEach(message => {
            messages.push({
               ...message.data(), 
               id: message.id,
            });
         });
      })
      .catch(err => {
         console.log(err.message);
      });
   return messages
}
