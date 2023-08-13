var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

const name = prompt('What is your name?');
const role = prompt('What is your role? (admin/staff/client)');

const room1 = 'admin-staff';
const room2 = 'admin-client';

let whichRoom = '';
if (role === 'admin') {
  whichRoom = prompt('Which room do you want to join? (1 for admin-staff, 2 for admin-client)');
}

const roomSelection = role === 'admin' ? (whichRoom === '1' ? room1 : room2) : (role === 'staff' ? room1 : room2);

socket.emit('new-user', { name, role, whichRoom });

form.addEventListener('submit', function(e) {
    e.preventDefault();
    var message = input.value;
    if (input.value) {
      const data = {message, name};
      socket.emit(roomSelection, data);
      appendMsg(`You: ${input.value}`);
      input.value = '';
    }
});

socket.on('chat message', data => {
  appendMsg(`${data.name}: ${data.message}`)
});

socket.on('user-connected', username => {
  appendMsg(`${username} joined the chat`)
});

function appendMsg(msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.append(item);
  window.scrollTo(0, document.body.scrollHeight); // auto-scroll to the bottom
}