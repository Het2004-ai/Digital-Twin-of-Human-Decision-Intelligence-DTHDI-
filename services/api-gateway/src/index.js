const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'api-gateway' });
});

const axios = require('axios');
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const BEHAVIOR_ENGINE_URL = process.env.BEHAVIOR_ENGINE_URL || 'http://localhost:8000';

// WebSocket logic
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('telemetry', async (data) => {
    // 1. Broadcast to Dashboard
    io.emit('behavioral_update', data);

    // 2. Forward to AI Behavior Engine for prediction
    try {
        const response = await axios.post(`${BEHAVIOR_ENGINE_URL}/predict`, {
            sessionId: data.sessionId,
            sequence: [[data.type === 'click' ? 1 : 0, data.data.x || 0, data.data.y || 0, 100]]
        });
        
        // 3. Emit prediction back to the user (Adaptive UI)
        socket.emit('intent_prediction', response.data);
    } catch (err) {
        // console.error('AI Service unreachable');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 DTHDI API Gateway running on port ${PORT}`);
});
