import React, { useEffect, useState } from 'react'
import { Box, ClickAwayListener, Popper } from '@mui/material';
import { ChatBox } from '../components/chatbox'
import { getDocValues } from '../utils';

// To-Do: Improve conditional placement logic. Find a way to do CSS Sticky? Use Refs for height and chatFits?

const modalHeight = 124;
const chatHeight = 400;
export function getChatHeight() {return chatHeight};

function doesChatFit(headHeight, docHeight) {
   return docHeight > (chatHeight + modalHeight + headHeight)
}
function generateBoundingRect() {
   let [headHeight, docHeight, docWidth, scrollY] = getDocValues();
   let chatFits = doesChatFit(headHeight, docHeight);
   let boundingClientRect = () => ({
      width: '0', height: '0', left: docWidth,
      top: chatFits 
      ? docHeight : scrollY <= (16 + headHeight) 
      ? 16 + headHeight - scrollY : scrollY <= (chatHeight + modalHeight + headHeight - docHeight) 
      ? 16 + headHeight - scrollY : docHeight
   })
   let placementBool = chatFits 
   ? true : scrollY <= (16 + headHeight) 
   ? false : scrollY <= (chatHeight + modalHeight + headHeight - docHeight) 
   ? false : true
   return ({boundingClientRect, placementBool})
}

export function ChatModal({ openedTicket, closeModal }) {
   const [virtualEl, setVirtualEl] = useState();
   const [placement, setPlacement] = useState();
   
   const setAnchor = () => {
      let {boundingClientRect, placementBool} = generateBoundingRect();
      setVirtualEl({
         getBoundingClientRect: boundingClientRect,
      });
      setPlacement(placementBool ? 'top-end': 'bottom-end');
   }
   
   useEffect(() => {
      setAnchor();
      window.addEventListener('scroll', () => {
         setAnchor();
      });
      let eventTimer = null;
      window.addEventListener('resize', () => {
         if (eventTimer !== null) {
            clearTimeout(eventTimer);
         }
         eventTimer = setTimeout(() => {
            setAnchor();
         }, 150);
      });
   }, []);

   return (
   <Popper open={Boolean(openedTicket)} placement={placement} anchorEl={virtualEl} sx={{borderRadius: 1, margin: '0px'}}>
      <ClickAwayListener onClickAway={closeModal} mouseEvent='onMouseDown'>
      <Box m={2} sx={{border: 4, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: 1}}>
         <ChatBox openedTicket={openedTicket} closeModal={closeModal} />
      </Box></ClickAwayListener>
   </Popper>
)}
