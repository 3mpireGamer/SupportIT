import React from 'react'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

export class ChatModal extends React.Component {
   state = {
      show: false,
   }
   render() {
      return (
         <ChatBubbleOutlineIcon></ChatBubbleOutlineIcon>
      );
   }
}
