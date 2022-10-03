// Load environment variables
require('dotenv').config();

const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const port = process.env.PORT || 5000;

const http = require('http');
const { ExpressPeerServer } = require('peer');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "/"
  }
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
  port: 443
});

let userNo = 1;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);

server.listen(port, () => {
  console.log(`Running on port ${port}`);
});

app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get('/:chatroom', (req, res) => {
  res.render('chatroom', { roomId: req.params.chatroom})
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);
  });
  console.log(`User ${userNo} has connected.`);
  userNo++;
});
