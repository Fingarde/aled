#!/usr/bin/env node

let meetingID = process.argv[2]
let internalUserID = process.argv[3]
let authToken = process.argv[4]
let externUserID = process.argv[5]

var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });

    connection.send(
        JSON.stringify([
            JSON.stringify({
                msg: "connect",
                version: "1",
                support: [
                    "1",
                    "pre2",
                    "pre1"
                ]
            }),
            JSON.stringify({
                msg: "method",
                method: "userChangedLocalSettings",
                params: [    
                    {
                        application: {
                            animations: true,
                            chatAudioAlerts: false,
                            chatPushAlerts: false,
                            userJoinAudioAlerts: false,
                            userJoinPushAlerts: false,
                            fallbackLocale: "en",
                            overrideLocale: null,
                            locale: "fr",
                            isRTL: false
                        },
                        audio:{
                            inputDeviceId: undefined,
                            outputDeviceId: undefined
                        },
                        dataSaving: {
                            viewParticipantsWebcams: true,
                            viewScreenshare: true
                        }
                    }
                ],
                id: "1"
            }),
            JSON.stringify({
                msg: "method",
                method: "validateAuthToken",
                params: [
                    meetingID,
                    internalUserID,
                    authToken,
                    externUserID
                ],
                id: "2"
            }),
            JSON.stringify({
                msg: "method",
                method: "validateAuthToken",
                params: [
                    meetingID,
                    internalUserID,
                    authToken
                ],
                id: "3"
            })
        ]))
});

client.connect('wss://newyork.iut-clermont.uca.fr/html5client/sockjs/535/f446nea5/websocket');