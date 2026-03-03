require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB, sequelize } = require('./config/db');
const { Server } = require('socket.io');
const myEmitter = require('./utils/eventEmitter');

connectDB();

const server = http.createServer(app);

// Start socket.io
const io = new Server(server, { 
  cors: { 
  origin: '*', 
  },
});

// Client connection
io.on('connection', (socket) => { 
  console.log('New user connected:', socket.id); 

  socket.on('disconnect', () => { 
  console.log('User left:', socket.id); 
  });
});

// EventEmitter → WebSocket connection
myEmitter.on('taskCreated', (task) => {
  io.emit('taskNotification', {
  message: 'New task created!',
  task,
  });
});
const PORT = process.env.PORT || 5001;

sequelize.sync({ alter: true }).then(() => {
  server.listen(PORT, () =>
  console.log(`Server is running on ${PORT} port`)
  );
});