import React, { useCallback, useEffect, useRef, useState } from "react";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { elementWidth } from "../utils";

const sx = {
   position: 'fixed', bottom: '0px', left: '0px', width: 'fit-content'
}

export function ScrollModal({ openedTicket }) {
   const [show, setShow] = useState(!openedTicket || window.innerWidth > elementWidth)
   const modalWidth = useRef();
   const scrollModal = useRef();

   const handleResize = useCallback(() => {
      if (scrollModal.current) modalWidth.current = scrollModal.current.clientWidth
      console.log(scrollModal.current)
      setShow(!openedTicket || window.innerWidth > elementWidth + modalWidth.current)
   }, [openedTicket])

   useEffect(() => {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
   }, [handleResize])

   //console.log(show)
   return (show ? 
   <Box width='0px'><Box p={2} sx={sx} ref={scrollModal}>
      <IconButton sx={{border: 1, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: 1, backgroundColor: 'secondary.dark'}} onClick={() => {
         document.getElementById('head').scrollIntoView({behavior: 'smooth'});
      }}><KeyboardArrowUpIcon color='black' /></IconButton>
   </Box></Box> : <></>
)}
