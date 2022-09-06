const http=require('http');
require('dotenv').config();

const express = require('express');
const { Server } = require('socket.io'); 

const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = new Server(server);
io.listen(server);

//db connection
mongoose.connect(process.env.MONGODB_CNN)
    .then(db=> console.log('db is connected'))
    .catch(err => console.log(err));

//settings


require('./src/sockets')(io);

//static files
app.use(express.static('src/public'));

//starting the server
server.listen(port,()=>{
    console.log('Server on port',port );
})