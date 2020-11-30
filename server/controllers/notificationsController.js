const Notification = require('../models/Notification');
const { emitNewNotification } = require('../socketio-server');

async function getUserNotifications(req, res) {
  if (req.id !== req.params.userId) {
    return res.status(403);
  }

  const notifications = await Notification.find({
    recipient: req.params.userId,
    read: false,
  });

  if (!notifications) {
    return res.status(404);
  }
  res.status(200).json(notifications);
}

async function postUserNotifications(req, res) {
  const { recipient, sender, type } = req.body;

  try {
    const notification = await Notification.create({
      read: false,
      recipient,
      sender,
      type,
    });
    emitNewNotification(recipient); 
    return res.status(201).json(notification);
  } catch (error) {
    console.log(error);
    return res.status(404);
  }
}

module.exports = { getUserNotifications, postUserNotifications };
