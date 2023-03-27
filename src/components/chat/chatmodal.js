import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material';
import { ChatBox } from './chatbox'

const bottomSx = {
   position: 'fixed', bottom: '0px', right: '0px',
   width: 'fit-content'
} 
const topSx = {
   position: 'fixed', top: '0px', right: '0px',
   width: 'fit-content'
} 

export function ChatModal({ openedTicket, closeModal }) {
   const chatModal = useRef();
   const [modalHeight, setModalHeight] = useState();
   const [modalWidth, setModalWidth] = useState();
   const [sx, setSx] = useState(bottomSx);
   const lastScroll = useRef({scrollY: 0, translateBottom: modalHeight - window.innerHeight, translateTop: 0});

   const completeRender = useCallback(() => {
      setModalHeight(chatModal.current.clientHeight);
      setModalWidth(chatModal.current.clientWidth);
   }, []);
   
   const scrolledToHead = useCallback((translateTop) => {
      return document.getElementById('head').clientHeight + (modalHeight - window.innerHeight - translateTop) > window.scrollY
   }, [modalHeight]);
   const chatFits = useCallback(() => {
      if (window.innerHeight > modalHeight) return window.innerHeight - (document.getElementById('head').clientHeight - window.scrollY) > modalHeight
      return modalHeight + document.getElementById('head').clientHeight < window.innerHeight
   }, [modalHeight]);

   const handleResizeOrScroll = useCallback(() => {
      let last = lastScroll.current;
      let userScrolledDown = last.scrollY < window.scrollY
      last = {scrollY: window.scrollY,  
         translateBottom: userScrolledDown ?
         Math.min(last.translateBottom + Math.abs(last.scrollY - window.scrollY), modalHeight - window.innerHeight) 
         : Math.abs(last.translateTop - (modalHeight - window.innerHeight)), 
         translateTop: !userScrolledDown ? 
         Math.min(last.translateTop + Math.abs(last.scrollY - window.scrollY), modalHeight - window.innerHeight) 
         : Math.abs(last.translateBottom - (modalHeight - window.innerHeight)),
      } 
      if (chatFits()) setSx(bottomSx);
      else if (userScrolledDown && !scrolledToHead(last.translateTop)) {
         setSx({...bottomSx, bottom: -(modalHeight - window.innerHeight) + last.translateBottom + 'px'});
      } else if (!userScrolledDown) {
         scrolledToHead(last.translateTop) 
         ? setSx({
            position: 'relative', top: '0px', right: modalWidth,
            width: 'fit-content'
         })
         : setSx({...topSx, top: -(modalHeight - window.innerHeight) + last.translateTop + 'px'});
      } 
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
