import io from 'socket.io-client';

const socket = io('/', { autoConnect: false });

export function markNotificationsRead(notifications, markReadSuccess) {
  socket.emit('mark read', notifications);
  socket.on('mark read success', () => {
    markReadSuccess();
  })
}

export function getNewNotifications(userId, updateNotifications) {
  let recipient;
  socket.on('new notification', (recipientId) => {
    recipient = recipientId;
    if (userId === recipientId) {
      socket.emit('get update', userId);
    }
  });
  socket.on('send updates', (data) => {
    if (userId === recipient) {
      updateNotifications(data);
    }
  })
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
  socket.disconnect();
}
