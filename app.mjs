import express from 'express';
import http from 'http';
import cors from 'cors';
import  { Server } from 'socket.io';
import { setupSocketIO } from './socketio.mjs';
const app = express();

const server = http.createServer(app);
setupSocketIO(server);
const io = new Server(server, {
    cors: {
        origin: "*", // Replace with your client's URL
        methods: ["GET", "POST"]
    }
});

app.use('/', function (req, res) {
    res.send('ok');
})
server.listen(8080, '0.0.0.0');