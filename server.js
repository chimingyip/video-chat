const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const port = 3000;

const server = require('http').Server(app);

const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get('/', (req, res) => {
  // res.send('Hello World!');
  res.redirect(`/${uuidv4()}`);
});

app.get('/:chatroom', (req, res) => {
  res.render('chatroom', { roomId: req.params.chatroom})
})

app.get('/chiming', (req, res) => {
  res.send('Hello Chi Ming!');
});

io.on('connection', (socket) => {
  console.log('A user has connected.');
});
