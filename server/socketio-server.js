// for socketio
const socketio = require('socket.io');
const socketAuth = require('socketio-auth');
const cookie = require('cookie');

// for auth
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET_KEY } = require('./config');
const User = require('./models/User');

const io = socketio();
var socketApi = {};
socketApi.io = io;

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
      console.log(`Socket ${socket.id} unauthorized.`);
      return callback({ message: 'Unauthorized user!' });
    }
  },
  postAuthenticate: (socket) => {
    console.log(`Socket ${socket.id} authenticated and Connected`);
    io.emit('welcome', {
      message: `Hello, your socket ID is ${socket.id}`,
    });
  },
  disconnect: (socket) => {
    console.log(`socket ${socket.id} disconnected.`);
  },
});

module.exports = socketApi;
