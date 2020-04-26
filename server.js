const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const messages = [];
let users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
})

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});

const io = socket(server);

io.on('connection', socket => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('join', user => {
    users.push(user)
    console.log(users)
    socket.broadcast.emit('join', user);
  })
  socket.on('message', message => {
    console.log('Oh, I\'ve got something from ' + socket.id)
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => {
    userName = users.filter(user => user.id === socket.id)[0];
    users = users.filter(user => user.id !== socket.id)

    console.log(users);
    console.log(userName);


    socket.broadcast.emit('removeUser', userName);

  });


  console.log('I\'ve added a listener on message event \n');
});

