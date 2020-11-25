// for socketio
const socketio = require('socket.io');
const socketAuth = require('socketio-auth');
const cookie = require('cookie');

// for auth
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET_KEY } = require('./config');
const User = require('./models/User');

const io = socketio();
const socketApi = {};
socketApi.io = io;

//To keep track of connected users
const userSocketIdMap = new Map();

//Function to add connected user to map
function addUser(userId, socketId) {
  userSocketIdMap.set(userId, socketId);
  console.log(userSocketIdMap);
}

//Function to remove socketId when user disconnects.
function removeUser(userId, socketId) {
  userSocketIdMap.delete(userId);
  console.log(userSocketIdMap);
}

// User verification - recieves jwt token from client as Cookie
async function verifyUser(token) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === '') {
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
    console.log(`Socket ${socket.id} authenticated and Connected`);

    // To add user to map
    if (!userSocketIdMap.has(socket.user)) {
      addUser(socket.user, socket.id);
    } else {
      socket.disconnect(true);
      console.log('postAuth', userSocketIdMap);
      console.log('User already connected');
    }

    io.emit('welcome', {
      message: `Hello, your socket ID is ${socket.id}`,
    });
  },
  disconnect: (socket) => {
    //To remove user from map
    removeUser(socket.user, socket.id);
    console.log(`socket ${socket.id} disconnected.`);
  },
  timeout: 1000,
});

module.exports = socketApi;
