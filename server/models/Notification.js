const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
