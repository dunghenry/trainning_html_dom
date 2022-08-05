const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const viewEngine = require('./configs/viewEngine');
dotenv.config();
const http = require('http');
const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const routes = require('./routes');
require('./configs/connect.db');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
viewEngine(app);
const io = require('socket.io')(server);
routes(app);
io.on('connection', (socket) => {
  console.log('User connected');
  console.log(socket.id);
  socket.on('disconnect', () =>{
    console.log('User disconnected');
  })
  socket.on('chat', (data) =>{
    console.log(data);
  })
});
server.listen(port, () => console.log(`Server listening on http://localhost:${port}`));