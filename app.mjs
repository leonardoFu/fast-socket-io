import express from 'express';
import http from 'http';
import cors from 'cors';
import  { Server } from 'socket.io';
import { setupSocketIO } from './socketio.mjs';
const app = express();
app.use(cors());

const server = http.createServer(app);
setupSocketIO(server);
const io = new Server(server, {
    cors: {
        origin: "*", // Replace with your client's URL
        methods: ["GET", "POST"]
    }
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});