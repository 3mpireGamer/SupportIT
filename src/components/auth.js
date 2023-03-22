import React, { useContext, useEffect, useState } from "react"
import { Button, Stack, TextField, Typography } from '@mui/material';
import { FirestoreContext } from "../app";
import { onSnapshot } from "firebase/firestore";
import ReCAPTCHA from "react-google-recaptcha";


export function Auth({ authenticate }) {
   const fs = useContext(FirestoreContext);
   const [users, updateUsers] = useState();
   useEffect(() => {
      onSnapshot(fs.users, (snapshot) => {
         let users = [];
         snapshot.docs.forEach(user => {
            users.push({...user.data()});
         });
         updateUsers(users);
      })
   }, [fs.users]);
   const [username, setUsername] = useState();
   const [password, setPassword] = useState();
   const [captchaComplete, completeCaptcha] = useState(false);
   const [authError, throwError] = useState('');

   const enterPressed = (id) => {
      switch (id) {
         case 'username':
            document.getElementById('password').focus();
            break;
         case 'password':
            password ? checkAuth() : throwError('Password cannot be empty!');
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
      let authError = 'Invalid username or password!';
      users.forEach(user => {
         if (username.toLowerCase() === user.username.toLowerCase() && password === user.password) {
            authenticate(user);
            authError = '';
         } 
      });
      throwError(authError);
   }

   return(
   <Stack alignItems='center'><Stack spacing={2} p={2} justifyContent='flex-start' maxWidth='400px'>
      {authError ? <Typography color='error' variant='body1' component='div' textAlign='center'>{authError}</Typography> : <></>}
      <TextField id='username' variant='outlined' label='Username' onChange={onChange}
         onKeyDown={(e) => {if (e.key === 'Enter') {enterPressed(e.target.id)}}} />
      <TextField id='password' variant='outlined' label='Password' type='password' onChange={onChange}
         onKeyDown={(e) => {if (e.key === 'Enter') {enterPressed(e.target.id)}}} />
      <ReCAPTCHA sitekey='6LcXnR8lAAAAAAh5TM61BWhEoJmhW3uEy3xXRo4s' onChange={() => completeCaptcha(true)} />
      {(username && captchaComplete) ? <Button onClick={checkAuth} variant='contained'>Login</Button>
      : <Button disabled variant='contained'>Login</Button>}
   </Stack></Stack>
   )
}
