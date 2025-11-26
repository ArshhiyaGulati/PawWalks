require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const walkController = require('./controllers/walkController');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/auth', require('./routes/authRoutes'));
app.use('/dogs', require('./routes/dogRoutes'));
app.use('/walks', require('./routes/walkRoutes'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);

  socket.on('join-walk', (walkId) => {
    socket.join(walkId);
  });

  socket.on('location-update', async ({ walkId, location }) => {
    if (!walkId || !location) return;
    io.to(walkId).emit('location-update', location);
    await walkController.appendLocation(walkId, location);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

