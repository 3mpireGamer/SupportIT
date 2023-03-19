import React, { useEffect, useState } from "react";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton, Popper } from "@mui/material";
import { Box } from "@mui/system";


function anchor() {
   return ({
      getBoundingClientRect: () => ({
         width: '0', height: '0', left: '0', 
         top: document.getElementById('root').offsetHeight
   })})};

export function ScrollModal() {
   const [virtualEl, setVirtualEl] = useState(anchor());
   
   useEffect(() => {
      setVirtualEl(anchor());
      window.addEventListener('scroll', () => {
         setVirtualEl(anchor());
      });
      let eventTimer = null;
      window.addEventListener('resize', () => {
         if (eventTimer !== null) {
            clearTimeout(eventTimer);
         }
         eventTimer = setTimeout(() => {
            setVirtualEl(anchor());
         }, 150);
      });
   }, []);
   return (
      <Popper open={true} anchorEl={virtualEl} placement='bottom-end'>  
         <Box m={2} sx={{ border: 1, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: '4px', backgroundColor: 'secondary.dark'}}>
            <IconButton color='black' onClick={() => {
               document.getElementById('head').scrollIntoView({behavior: 'smooth'});
            }}><KeyboardArrowUpIcon /></IconButton>
         </Box>
      </Popper>
)}
