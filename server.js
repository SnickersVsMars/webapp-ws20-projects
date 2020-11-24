const express = require('express');
const path = require('path');
const router = require('./client/clientRouter');
const server = express();
const port = 3000;
const clientRounter = require('./client/clientRouter')

server.set('port', process.env.PORT || port);
server.use(express.static('client'));


server.use('/',router);

//Express error handling middleware
server.use((request,response)=>{
   response.type('text/plain');
   response.status(505);
   response.send('Error page');
});

//Binding to a port
server.listen(port, ()=>{
  console.log('Express server started at port 3000');
});