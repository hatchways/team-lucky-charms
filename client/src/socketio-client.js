import io from 'socket.io-client';

const socket = io('/', {
  autoConnect: false,
});

export function markNotificationsRead(notifications, markReadSuccess) {
  socket.emit('mark read', notifications);
  socket.on('mark read success', () => {
    markReadSuccess();
  });
}
export function getNewNotifications(updateNotifications) {
  socket.on('new notifications', (data) => {
    updateNotifications(data);
  });
}

export function connectClient() {
  socket.on('connect', () => {
    console.log('Connected');
    socket.emit('authentication');
    socket.on('welcome', (data) => {
      console.log(data.message);
    });
    socket.emit('message', { data: 'message' });
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
  socket.disconnect(true);
}

export function sendMessage(senderId, receiverId, message) {
  socket.emit('send-message', {
    senderId,
    receiverId,
    message,
  });
}

export function setInbound(onMessageReceived) {
  socket.removeAllListeners('receive-message');
  socket.on('receive-message', (message) => {
    onMessageReceived(message);
  });
}

export function emitNewConversation(receiverId) {
  socket.emit('new-conversation', receiverId);
}

export function listenNewConversation(onNewConversation) {
  socket.removeAllListeners('new-conversation');
  socket.on('new-conversation', onNewConversation);
}