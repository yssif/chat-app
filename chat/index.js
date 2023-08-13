const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.use(express.static('public'));

// Serve the chat room page
app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});


const users = {};

const room1 = 'admin-staff';
const room2 = 'admin-client';

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('new-user', (data) => {
      console.log(`${data.name} just joined as ${data.role}`);
      users[socket.id] = data;

      if (data.role === 'admin' && data.whichRoom === '1') {
          socket.join(room1);
      } else if (data.role === 'admin' && data.whichRoom === '2') {
          socket.join(room2);
      } else if (data.role === 'staff') {
          socket.join(room1);
      } else if (data.role === 'client') {
          socket.join(room2);
      }
  });

  socket.on(room1, (data) => {
      console.log(`message in ${room1}: ${data.message}`);
      socket.broadcast.to(room1).emit('chat message', data);
  });

  socket.on(room2, (data) => {
      console.log(`message in ${room2}: ${data.message}`);
      socket.broadcast.to(room2).emit('chat message', data);
  });

  socket.on('disconnect', () => {
      console.log('user disconnected');
  });
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});

