import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material';
import { ChatBox } from './chatbox'

const initialSx = {
   position: 'relative', width: 'fit-content'
}

const bottomSx = {
   position: 'fixed', bottom: '0px', right: '0px', width: 'fit-content'
} 

export function ChatModal({ openedTicket, closeModal }) {
   const chatModal = useRef();
   const [modalHeight, setModalHeight] = useState();
   const [modalWidth, setModalWidth] = useState();
   const [sx, setSx] = useState(initialSx);
   const lastScroll = useRef({scrollY: 0, translate: 0});

   const completeRender = useCallback(() => {
      setModalHeight(chatModal.current.clientHeight);
      setModalWidth(chatModal.current.clientWidth);
   }, []);
   
   const scrolledToHead = useCallback((translate) => {
      return document.getElementById('head').clientHeight + (modalHeight - window.innerHeight + translate) > window.scrollY
   }, [modalHeight]);
   const chatFits = useCallback(() => {
      if (window.innerHeight > modalHeight) return window.innerHeight - (document.getElementById('head').clientHeight - window.scrollY) > modalHeight
      return modalHeight + document.getElementById('head').clientHeight < window.innerHeight
   }, [modalHeight]);

   const handleResizeOrScroll = useCallback(() => {
      let last = lastScroll.current;
      last = {scrollY: window.scrollY, 
         translate: Math.min(Math.max(last.translate + window.scrollY - last.scrollY, -(modalHeight - window.innerHeight)), 0)
      } 
      if (chatFits()) setSx(bottomSx);
      else if (!scrolledToHead(last.translate)) setSx({...bottomSx, bottom: last.translate + 'px'});
      else setSx({...initialSx, right: modalWidth});
      lastScroll.current = last;
   }, [chatFits, scrolledToHead, modalHeight, modalWidth])

   useEffect(() => {
      window.addEventListener('resize', handleResizeOrScroll);
      document.addEventListener('scroll', handleResizeOrScroll);
      return () => {
         window.removeEventListener('resize', handleResizeOrScroll);
         document.removeEventListener('scroll', handleResizeOrScroll);
      }
   }, [modalHeight, handleResizeOrScroll]);

   return (openedTicket ? <Box width='0px'>
   <Box ref={chatModal} p={2} sx={sx}><Box border={4} borderColor='rgba(0, 0, 0, 0.27)' borderRadius={1}>
      <ChatBox openedTicket={openedTicket} closeModal={closeModal} completeRender={completeRender}/>
   </Box></Box></Box> : <></>
)}
