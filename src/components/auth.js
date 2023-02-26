import React, { useState } from "react"
import { Button, Grid, TextField, Typography } from '@mui/material';

const users = [
   {username: 'admin', password: 'p@ssw0rd'},
   {username: 'user', password: 'password'},
];

export function Auth({ authenticate }) {
   const [username, setUsername] = useState();
   const [password, setPassword] = useState();
   const [authError, throwError] = useState(false);

   const enterPressed = (id) => {
      switch (id) {
         case 'username':
            document.getElementById('password').focus();
            break;
         case 'password':
            checkAuth();
            break;
         default:
      }
   }
   const onChange = (e) => {
      switch (e.target.id) {
         case 'username':
            setUsername(e.target.value);
            break;
         case 'password':
            setPassword(e.target.value);
            break;
         default:
      }
   }

   const checkAuth = () => {
      let match = true;
      users.forEach(user => {
         if (username === user.username && password === user.password) {
            authenticate(username);
            match = false;
         } 
      });
      throwError(match);
   }

   return(
   <Grid container direction='column' spacing={2} alignContent='center' mt={2}>
      <Grid item xs={12}><TextField id='username' variant='outlined' label='Username' onChange={onChange}
      onKeyDown={(e) => {if (e.key === 'Enter') {enterPressed(e.target.id)}}}></TextField></Grid>
      <Grid item xs={12}><TextField id='password' variant='outlined' label='Password' type='password' onChange={onChange}
      onKeyDown={(e) => {if (e.key === 'Enter') {enterPressed(e.target.id)}}}></TextField></Grid>
      <Grid item xs={12}><Button onClick={checkAuth} variant='contained'>Login</Button></Grid>
      {authError ? <Grid item xs={12}><Typography color='error' variant='h6'>Invalid username or password!</Typography></Grid> : null}
   </Grid>
   )
}
