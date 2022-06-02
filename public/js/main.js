//Frontend
const chatForm = document.getElementById('chat-form');
const chatDisplay = document.getElementById('chat-messages');
const chatMessages = document.querySelector('.chat-messages');
const userNames = document.getElementById('users');

//Nutzer von URL 

const username = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

socket.emit('joinRoom',  username);

//Nutzer senden
socket.on('users', (users) => {
    outputUsers(users);
})

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Code zum runterscrollen
    chatMessages.scrollTop = chatMessages.scrollHeight;

})


//Event Listener für Chat Form
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //msg text holen
    const msg = e.target.elements.msg.value;

    //Msg an server senden
    socket.emit('chatMessage', msg);

    //Eingabe löschen
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
    

});


//Message in Dom einbauen
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = 
    `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


//Nutzer hinzufügen
function outputUsers(users){
    userNames.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
