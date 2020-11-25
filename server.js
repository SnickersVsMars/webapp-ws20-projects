const express = require('express');
const router = require('./features/router');
const bodyParser = require('body-parser')

const server = express();
const port = 3000;

server.set('port', process.env.PORT || port);
server.use(express.static('public'));
 
// parse application/json
server.use(bodyParser.json())

server.use('/', router);

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