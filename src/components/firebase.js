import { initializeApp } from 'firebase/app';
import { addDoc, collection, doc, getDocs, getFirestore, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';


export function firestoreInit() {
   const firebaseConfig = {
      apiKey: "AIzaSyC7Loi9_eiajp7-E5JP1LPCFRzbfHY4sag",
      authDomain: "support-ticketing-manager.firebaseapp.com",
      projectId: "support-ticketing-manager",
      storageBucket: "support-ticketing-manager.appspot.com",
      messagingSenderId: "403186507043",
      appId: "1:403186507043:web:da892e3c03554157438096"
   }
   
   const app = initializeApp(firebaseConfig);
   initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider('6Ld6rh8lAAAAALnjM9RPT-bImyHlE9fp8-iNlY1V'),
      isTokenAutoRefreshEnabled: true
    });
   let db = getFirestore();
   let ticketCollection = collection(db, 'tickets');
   let userCollection = collection(db, 'users');
   return {
      db,
      collection: ticketCollection, 
      users: userCollection, 
      query: query(ticketCollection, where('updated', 'not-in', ['']), orderBy('updated', 'desc'))
   }
}

export function getTickets(query, filter) {
   let ticketsPromise = new Promise((resolve) => {
   getDocs(query).then((snapshot) => {
      let tickets = [];
      snapshot.docs.forEach(ticket => {
         let temp = {...ticket.data()};
         temp.created = temp.created.toDate();
         temp.updated = temp.updated.toDate();
         temp.messages.forEach(message => {
            message.dateTime = message.dateTime.toDate();
         });
         tickets.push({
            ...temp, 
            id: ticket.id,
         }); 
      })
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
   });
   return ticketsPromise
}
export function getLiveUpdate(snapshot) {
   let ticketPromise = new Promise((resolve) => {   
      let ticket = {...snapshot.data(), id: snapshot.id};
      ticket.created = ticket.created.toDate();
      ticket.updated = ticket.updated.toDate();
      ticket.messages.forEach(message => {
         message.dateTime = message.dateTime.toDate();
      });
      resolve(ticket);
   })
   return ticketPromise
} 

export function getOpenedTicket(db, id) {
   return doc(db, 'tickets', id)
}
export function addTicket(ticketCollection, ticket) {
   addDoc(ticketCollection, ticket)
}
export function updateTicket(db, ticket) {
   let docRef = doc(db, 'tickets', ticket.id);
   delete ticket.id; 
   updateDoc(docRef, ticket);
}
