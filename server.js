const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const messages = require('./utils/messages.js');
const users = require('./utils/users.js');
const cors = require('cors');

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = socketio(server);
const botName = 'Admin Bot';

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

app.use(function(req,res,next){     res.header("Access-Control-Allow-Origin", "*");     res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");     res.header("Access-Control-Allow-Headers", "Accept, Content-Type, Authorization, X-Requested-With");          next();   });

//Run when Client connects
io.on('connection', socket => {

    socket.on('joinRoom', (username) =>{

        const user = users.userJoin(socket.id, username.username);

        //nur an speziellen Client
        socket.emit('message', messages.formatMessage(botName, 'Wilkommen im Gruppenchat' ));

        //an alle außer speziellen Client
        console.log(user);
        socket.broadcast.emit('message', messages.formatMessage(botName, `${user.username} ist dem Gruppenchat beigetreten`));

    //Nutzer senden
    io.emit('users', users.getUsers());

    });


    //an alle
    //io.emit()

    //Auf chatMessage warten
    socket.on('chatMessage', (msg) => {
        const user = users.getCurrentUser(socket.id);
       io.emit('message', messages.formatMessage(user.username, msg));
    })

    //Wenn Client Verbindung trennt
    socket.on('disconnect', () => {
        const user = users.userLeave(socket.id);
    if(user){
        io.emit('message', messages.formatMessage(botName, `${user.username} hat den Gruppenchat verlassen`));
    }
    //Nutzer senden
    io.emit('users', users.getUsers());

       
    })

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

