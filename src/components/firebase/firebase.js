import { initializeApp } from 'firebase/app';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';

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
   let db = getFirestore();
   return collection(db, 'tickets')
}

export function getTickets(ticketCollection) {
   let tickets = [];
   let ticketsPromise = new Promise((resolve, reject) => {
      getDocs(ticketCollection)
      .then((snapshot) => {
         snapshot.docs.forEach(ticket => {
            tickets.push({
               ...ticket.data(), 
               id: ticket.id,
            });    
         });
         resolve(tickets);
      })
      .catch(err => {
         console.log(err.message);
         resolve({});
      });
   });
   return ticketsPromise
} 

export function addTicket(ticketCollection, ticket) {
   addDoc(ticketCollection, ticket)
}