import admin from 'firebase-admin';
import { Server } from 'socket.io';
import fs from 'fs';

let rawdata = fs.readFileSync('./serviceAccount.json');
let serviceAccount = JSON.parse(rawdata);
const SOCKET_EVENTS = {
    OTT: 'phone-controller:ott',
    CONTROLLER: 'phone-controller:controller',
    SERVER: 'phone-controller:controller',
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const setupSocketIO = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        [SOCKET_EVENTS.OTT, SOCKET_EVENTS.CONTROLLER].forEach((event) => {
            socket.on(event, (msg) => {
                io.emit(event, msg);
            });
        });

        socket.on(SOCKET_EVENTS.SERVER, (msg) => {
            if (msg.type === 'send-notification' && msg.payload) {
                admin.messaging().send({
                    notification: {
                        title: 'TubiTV phone controller🕹️',
                        body: 'Use your phone to input for Tubi TV',
                    },
                    token: msg.payload.token,
                    data: {
                        controllerUrl: msg.payload.controllerUrl
                    }
                });
            }
        });
    });

    return io;
};
