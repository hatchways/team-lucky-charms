const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    myId: { type: String },
    messages: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Message', index: true },
    ],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
    receiverHasRead: { type: Boolean },
  },

  { timestamps: true },
);

conversationSchema.index({ myId: 'text' });

const Conversation = mongoose.model('Conversation', conversationSchema);
Conversation.createIndexes();

module.exports = Conversation;
