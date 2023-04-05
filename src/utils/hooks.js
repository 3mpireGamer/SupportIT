import { useEffect, useRef, useState } from 'react'
import { getLiveUpdate, getOpenedTicket } from './firebase';
import { onSnapshot } from 'firebase/firestore';

export function useLiveTicketUpdates(fs, openedTicket) {
   const [selectedTicket, setTicket] = useState({});
   const [error, setError] = useState(false);
   const unsubscribe = useRef(() => {});
   useEffect(() => {
      if (openedTicket) {
         unsubscribe.current = onSnapshot(getOpenedTicket(fs.db, openedTicket), (snapshot) => {
            updateState(snapshot, setTicket, setError)
      })} 
      return () => {unsubscribe.current()}
   }, [fs, openedTicket]);

   return {
      selectedTicket, 
      error,
   }
}

function updateState(snapshot, setTicket, setError) {
   getLiveUpdate(snapshot)
      .then(result => {
         setTicket(result);
         setError(false);
      })
      .catch(_ => setError(true))
}