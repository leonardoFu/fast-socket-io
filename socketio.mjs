import admin from 'firebase-admin';
import { Server } from 'socket.io';

const serviceAccount = {
    "type": "service_account",
    "project_id": "phone-controller-f317f",
    "private_key_id": "6a485456b62aadf6e7a0774adff03b4818664ad8",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDA0Z5lLPPgvuTU\n8MfHNf3A0xfTg17E11Tp+mp0ZRy8+f+B23GJRhSda2sVdPSzFwBSQKg2NN1kAP5w\na5nJVrDmXDVhgfIWfgaimssLBaObLPczJwXZyGOso91ddqal8nnHSyWEtoAUNgHw\nBlWuiqV+/9WogI4GuL0/Tb3ffSBtv0BNWAMdtNlhWhgxiVMF1YXDVJXB9MmImXBi\nkYUXniFhWwaLWY7NexhhO8GGKBKmmT4kIgedgVYcBNYoJ3K1UUkYmFeVkSpsM7SQ\nwzHzQHCsQ849OVe9JXw+yp/s/gV5lneY1VDbBTvUmaMjZ7ih6EcruL53ruc7xtTG\n7n00UsPBAgMBAAECggEAB4cHbn67RJ5fM5r0yaencOQszXKW/AtGAt5mUoXyAcSm\nv2yQOaI1QtIDO7K1rNoshomEp50XuYQ6aqwgtFYAkPWvlc9rYopn+ugdHiCJuxCd\n0+7lkRN8JKy/AxuTNO5K58dcvxoa1O8o0zSEGszJ2jPlpO7j3IpQxQxlabiqT+5y\nc7lR2At6b0BUZ2po8hJUPlfXyvAf15CYWZk1A3JZr8M6lIt2CPcPOaB+M6oX7CIa\nfyT+vN4+E4N1Z052c7+mliDjsD/VJLqMQ+2EMhOZdS7NalYRy0GV4jClICaP2y/O\nAAY4iDFytED2uuO/wH+1fOFe5MmQzpMpdZtdrGXiuwKBgQD+hTSWvjKz5A3Tmo8e\nzSS8Et5sV1jAWJItV639WpN6SuZzpKCVAWUzX23O/pYp9cuLaGapweN3Me1tac0C\ns/3beCiVfGo2kiP2VPo4DVfh3M9Ach+aMI+JlZ2nfN2yG0cE8nVPrLIKMUbszNW2\nl7vuT7zsnZ3/xf2i2YpuXlA+HwKBgQDB8JW7yHzYa9x8peebYjzJ0nkMxYVlBcKH\ntqI7FAGVhCDKWzyYTCavdQALOnH7R2Off0wc+8maGTcvojM9Gq4yqgtq7uzhFa1i\n1RjCtNmlS5odtr15LTEf9be4XvKMU7AixSvEtEFkzDrzMD/+6cIWD62Ys9kDD+3p\nwhU71gECHwKBgBMUh1G5pnFn6kVvs8T6WgOjYns6vROGUEcH6KoyjRXA4a/Pqp4h\nAaYtRD0dRsKUg5LK289kEppP6t2l7dGDDsfSJTC3p/q5T+raifuDvI/ZDsxlAct8\nUnZc+fmhWblNZDCRwIudhadP9GIyJN9QVq1R2vbeBgczn4UCy+bkOR2/AoGBAKdu\nT6aNoJKrE/AcvsYb2oUWiuDmyZH8lgPaPVapn/B34GMyvy5wV9mUNdR7wZmA+VXi\nbVB8Y4EBEe6ypm+zT/53ZWINIT31G/o+JKE7xsZ4bXYHpK4vwMBpvxGSDu3s9hwe\ngvnP8MDXvHDlD+q/3opzQJibc9e78dakcvZ0e+xbAoGABi4qyVhcrF4juwVBcgSM\n40XiXuKIiUm1lp1beko+lcCn50Xs/Oyaupq5rWmwVmaADtMQvBHRXrgTLd9i+HuC\nxTrgTlE6Loz1s4xXnmR2KPiQSGvNTQ+PllDLjT+NPUH59crARYG/O11lesxcdQjC\nW5u8JVeBi+G2wko1WDB4oMY=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-k9lmo@phone-controller-f317f.iam.gserviceaccount.com",
    "client_id": "105376423122516974492",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k9lmo%40phone-controller-f317f.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

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
            credentials: true
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
