// for socketio
const socketio = require('socket.io');
const socketAuth = require('socketio-auth');
const cookie = require('cookie');

// for auth
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET_KEY } = require('./config');
const User = require('./models/User');

// for databse update
const { updateConversation } = require('./controllers/conversationController');

const io = socketio();
const socketApi = {};
socketApi.io = io;
//socketApi.handleNewConversation = handleNewConversation;

//To keep track of connected users. Map stores <userId:Set[sockets]>
const userSocketIdMap = new Map();

/*
This method checks if user already exists in the map.
If yes, it adds the socket to the Set of sockets.
If no, it adds the user to the map and creates a new Set with socketId.
*/
function addUser(userId, socketId) {
  if (!userSocketIdMap.has(userId)) {
    userSocketIdMap.set(userId, new Set([socketId]));
    console.debug(userSocketIdMap);
  } else {
    userSocketIdMap.get(userId).add(socketId);
    console.debug(userSocketIdMap);
  }
}

/* This function removes socketId from userId's Set of sockets.
Then checks if user has any more sockets,
if yes, do nothing
else, delete the user form the map*/
function removeUser(userId, socketId) {
  try {
    userSocketIdMap.get(userId).delete(socketId);
    if (userSocketIdMap.get(userId).size === 0) {
      userSocketIdMap.delete(userId);
      console.debug(userSocketIdMap);
    }
  } catch (error) {
    console.log('No users online');
  }
}

function getReceiverSockets(receiverUserId) {
  if (!userSocketIdMap.has(receiverUserId)) {
    return null;
  }
  return userSocketIdMap.get(receiverUserId);
}

async function handleMessages(socket) {
  socket.removeAllListeners('send-message');

  socket.on('send-message', async (data) => {
    // save messages to mongo -> in users conversation
    const newMessage = await updateConversation(
      data.senderId,
      data.receiverId,
      data.message,
    );

    const sockets = getReceiverSockets(data.receiverId);
    if (!sockets) {
      // user offline - notification
      console.debug('User offline. Message saved.');
    } else {
      // user online - no notification
      sockets.forEach((socketId) => {
        console.debug('Emitting message to receiver');
        socket.to(socketId).emit('receive-message', newMessage);
      });
    }
  });
}

function handleNewConversation(socket) {
  socket.removeAllListeners('new-conversation');
  socket.on('new-conversation', (receiverId) => {
    const sockets = getReceiverSockets(receiverId);

    if (!sockets) {
      return;
    } else {
      sockets.forEach((socketId) => {
        console.debug('Emitting new conversation listener');
        socket.to(socketId).emit('new-conversation');
      });
    }
  });
}

// User verification - recieves jwt token from client as Cookie
async function verifyUser(token) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!token) {
        return reject('User Not Found!');
      }

      // decode UserID from jwt token
      const decoded = jwt.verify(token, TOKEN_SECRET_KEY);
      const userID = decoded.id;

      // check if userID exists in database of Users
      getUser(userID);
      async function getUser(userID) {
        const user = await User.find({ _id: userID });

        if (user.length === 0) {
          return reject('User Not Found!');
        }
        return resolve(userID);
      }
    }, 200);
  });
}
socketAuth(io, {
  authenticate: async (socket, data, callback) => {
    const { jwt } = cookie.parse(socket.request.headers.cookie || '');
    try {
      const userID = await verifyUser(jwt);
      socket.user = userID;
      return callback(null, true);
    } catch (error) {
      console.log(`Socket ${socket.id} unauthorized.`, error);
      return callback({ message: 'Unauthorized user!' });
    }
  },
  postAuthenticate: (socket) => {
    // Add user to map
    addUser(socket.user, socket.id);

    // Handle socket messaging
    handleMessages(socket);
    handleNewConversation(socket);
  },

  disconnect: (socket) => {
    //Remove user from map
    removeUser(socket.user, socket.id);

    socket.disconnect(true);
  },
  timeout: 1000,
});

module.exports = socketApi;
