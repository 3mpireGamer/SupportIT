import React from "react"

const users = [
   {username: 'admin', password: 'p@ssw0rd'},
   {username: 'user', password: 'password'},
];

export function Auth({}) {
   users.forEach(user => {
      console.log(user.username);
      console.log(user.password);
   });
   return(
      <div>
         Auth Page
      </div>
   )
}
