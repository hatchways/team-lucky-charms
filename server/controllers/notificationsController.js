const Notification = require('../models/Notification');

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

module.exports = { getUserNotifications };
