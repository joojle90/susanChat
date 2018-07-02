'use strict';

require('dotenv').config()
const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;

const express = require('express');
const app = express();

//app.use(express.static(__dirname + '/UI_SusanTalk/views')); // html
//app.use(express.static(__dirname + '/UI_SusanTalk/public')); // js, css, images

app.use(express.static(__dirname + '/UI_InputUser/views'));
app.use(express.static(__dirname + '/UI_InputUser/public'));

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const io = require('socket.io')(server);
io.on('connection', function (socket) {
    console.log('a user connected');
});

const apiai = require('apiai')(APIAI_TOKEN);

// Web UI
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

io.on('connection', function (socket) {
    socket.on('chat message', (text) => {
        console.log('Message: ' + text);

        // Get a reply from API.ai

        let apiaiReq = apiai.textRequest(text, {
            sessionId: APIAI_SESSION_ID
        });

        apiaiReq.on('response', (response) => {
            let aiText = response.result.fulfillment.speech;

            var resultAPI = {
                text: aiText,
                responseAPI: response
            };
            
            console.log('Bot reply: ' + aiText);
            socket.emit('bot reply', resultAPI);
        });

        apiaiReq.on('error', (error) => {
            console.log(error);
        });

        apiaiReq.end();

    });
});
