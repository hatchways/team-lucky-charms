import io from 'socket.io-client';

const socket = io('/', {
  autoConnect: false,
});

export function connectClient() {
  socket.on('connect', () => {
    console.log('Connected');
    socket.emit('authentication');
    socket.on('welcome', (data) => {
      console.log(data.message);
    });

    socket.on('receive-message', (message) => {
      console.log(message);
    });
  });

  socket.on('unauthorized', (reason) => {
    console.log(`Unauthorized: ${reason.message}`);

    socket.disconnect();
  });

  socket.on('disconnect', (reason) => {
    console.log(`Disconnected: ${reason}`);
  });

  socket.open();
}

export function disconnectClient() {
  socket.disconnect();
}

export function sendMessage() {
  socket.emit('send-message', {
    receiver: '5fbe7d48908987bcf050d089',
    message: 'Hello 89!!!',
  });
}
