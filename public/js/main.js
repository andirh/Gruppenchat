//Frontend
const chatForm = document.getElementById('chat-form');
const chatDisplay = document.getElementById('chat-messages');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

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
    `<p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">
        ${message}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
