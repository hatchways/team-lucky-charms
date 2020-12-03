const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    message: { type: String },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  },
  { timestamps: true },
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
