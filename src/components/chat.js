const chatHeight = 400
function getChatHeight() {return chatHeight}

function doesChatFit() {
   let docHeight = document.getElementById('root').offsetHeight;
   let headHeight = document.getElementById('head').offsetHeight;
   return docHeight > (chatHeight + 216 + headHeight)
}
function generateBoundingRect() {
   let chatFits = doesChatFit()
   let headHeight = document.getElementById('head').offsetHeight;
   let docHeight = document.getElementById('root').offsetHeight;
   let docWidth = document.getElementById('root').offsetWidth;
   let scrollY = window.scrollY;
   let boundingClientRect = () => ({
      width: '0', height: '0', left: docWidth,
      top: chatFits 
      ? docHeight : scrollY <= (16 + headHeight) 
      ? 16 + headHeight - scrollY : scrollY <= (chatHeight + 216 + headHeight - docHeight) 
      ? 16 + headHeight - scrollY : docHeight
   })
   let placementBool = chatFits 
   ? true : scrollY <= (16 + headHeight) 
   ? false : scrollY <= (chatHeight + 216 + headHeight - docHeight) 
   ? false : true
   return ({boundingClientRect, placementBool})
}

function getMessages(ticket, authenticated) {
   return (ticket.messages.map(message => {
      return authenticated === message.author
      ? (<Grid item key={message.id}><Grid container>
      <Grid item xs={2}></Grid>
      <Grid item xs={10}>
         <Box sx={{ border: 1, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: '4px', boxSizing: 'border-box'}}>
            <Typography textAlign='right' fontWeight='bold'>{message.author}</Typography>
            <Typography textAlign='right'>{message.content}</Typography>
         </Box>
      </Grid></Grid></Grid>)
      : (<Grid item key={message.id}><Grid container>
      <Grid item xs={10}>
         <Box sx={{ border: 1, borderColor: 'rgba(0, 0, 0, 0.27)', borderRadius: '4px', boxSizing: 'border-box'}}>
            <Typography textAlign='left' fontWeight='bold'>{message.author}</Typography>
            <Typography textAlign='left'>{message.content}</Typography>
         </Box>
      </Grid><Grid item xs={2}></Grid>
      </Grid></Grid>)
   }));
}

function formatDate(date) {
   return parseMonth(date.getMonth()) + ' ' + date.getDate() + ' ' + date.getFullYear()
}
function parseMonth(month) {
   switch(month) {
      case 0: return 'Jan'
      case 1: return 'Feb'
      case 2: return 'Mar'
      case 3: return 'Apr'
      case 4: return 'May'
      case 5: return 'Jun'
      case 6: return 'Jul'
      case 7: return 'Aug'
      case 8: return 'Sep'
      case 9: return 'Oct'
      case 10: return 'Nov'
      case 11: return 'Dec'
      default: return ''
   }
}