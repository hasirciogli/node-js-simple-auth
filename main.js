const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


const { mainFunc } = require('./functions/auth.js');
const { callSql } = require("./functions/database.js");

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public_html/index.html');
});

io.on('connection', (socket) => {
    mainFunc(socket,() => {

    });
    console.log('a user connected from -> ' + socket.id);

    socket.on('disconnect', () => { console.log('user disconnected'); });
});

server.listen(80, () => {
  console.log('listening on *:80');
});