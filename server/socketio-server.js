// for socketio
const socketio = require('socket.io');
const socketAuth = require('socketio-auth');
const cookie = require('cookie');

// for auth
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET_KEY } = require('./config');
const User = require('./models/User');
const Notification = require('./models/Notification');

const io = socketio();
const socketApi = {};
socketApi.io = io;

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
  } else {
    userSocketIdMap.get(userId).add(socketId);
  }
}

/* This function removes socketId from userId's Set of sockets.
Then checks if user has any more sockets,
if yes, do nothing
else, delete the user form the map*/
function removeUser(userId, socketId) {
  userSocketIdMap.get(userId).delete(socketId);
  if (userSocketIdMap.get(userId).size === 0) {
    userSocketIdMap.delete(userId);
  }
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
    // Add user to map
    addUser(socket.user, socket.id);
    io.emit('welcome', {
      message: `Hello, your socket ID is ${socket.id}`,
    });
  },
  disconnect: (socket) => {
    //Remove user from map
    removeUser(socket.user, socket.id);
  },
  timeout: 1000,
});

async function emitNewNotification(userId) {
  try {
    if (userSocketIdMap.has(userId)) {
      const notifications = await Notification.find({
        recipient: userId,
        read: false,
      });
      userSocketIdMap.get(userId).forEach((socket) => {
        io.to(socket).emit('new notifications', notifications);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

io.on('connection', (socket) => {
  socket.on('mark read', (notifications) => {
    notifications.forEach(async (notification) => {
      try {
        await Notification.updateOne({ _id: notification._id }, { read: true });
        socket.emit('mark read success');
      } catch (error) {
        console.log(error);
      }
    });
  });
});

module.exports = { socketApi, emitNewNotification };
