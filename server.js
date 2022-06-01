const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'Admin Bot';

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Run when Client connects
io.on('connection', socket => {

    //nur an speziellen Client
    socket.emit('message', formatMessage(botName, 'Wilkommen im Gruppenchat' ));

    //an alle außer speziellen Client
    socket.broadcast.emit('message', 'Ein Nutzer ist dem Gruppenchat beigetreten');

    //an alle
    //io.emit()

    //Wenn Client Verbindung trennt
    socket.on('disconnect', () => {
        io.emit('message', 'Ein Nutzer hat den Gruppenchat verlassen');
    })


//Auf chatMessage warten
socket.on('chatMessage', (msg) => {
    io.emit('message', 'USER', msg);
})

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

