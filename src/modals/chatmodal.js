import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Box, ClickAwayListener, Grid, Popover, Typography } from '@mui/material';

export function ChatModal({ openedTicket, openTicket }) {
   return (
   <Box>
      <Popover open={Boolean(openedTicket)}
         anchorReference="anchorPosition"
         anchorPosition={{ 
            top: document.getElementById('root').offsetHeight, 
            left: document.getElementById('root').offsetWidth 
         }}
         anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
         }}
         transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
      }}>
         <ClickAwayListener onClickAway={() => {openTicket(0)}}>
            <Grid container>
               <ChatBubbleOutlineIcon />
               <Typography>Case Number: {openedTicket}</Typography>
            </Grid>
         </ClickAwayListener>
      </Popover>
   </Box>
);}
