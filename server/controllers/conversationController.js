const Conversation = require('../models/conversation');
const User = require('../models/User');
const Message = require('../models/messages');

function createConversationId(sender, receiver) {
  return [sender, receiver].sort().toString();
}

async function createConversation(req, res) {
  // create conversation ID
  const conversationId = createConversationId(req.id, req.body.receiverId);
  // check if conversation already exists
  const conversation = await Conversation.findOne({ myId: conversationId });

  // if no conversation -> create one
  if (!conversation) {
    const conversation = new Conversation({
      myId: conversationId,
      users: [req.id, req.body.receiverId],
    });
    try {
      const result = await conversation.save();
      res.status(201).send(result);

      //Add conversation Id to both Users
      await User.updateMany(
        { _id: { $in: [req.id, req.body.receiverId] } },
        {
          $push: { conversations: conversationId },
        },
      );
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  // if conversation already exists -> load
  else {
    console.log('Conversation already exists');
    res.status(200).send();
  }
}

async function getConversationsForUser(req, res) {
  /* Load all conversations for the user and also populate selected details of the user he is texting*/
  const conversations = await Conversation.find({
    $text: { $search: req.id },
  })
    .populate({ path: 'messages', select: ['message', 'sender'] })
    .populate({
      path: 'users',
      match: { _id: { $ne: req.id } },
      select: ['name', 'location', 'avatar'],
    });

  if (!conversations) {
    return res.status(404);
  }
  res.status(200).send(conversations);
}

async function updateConversation(senderId, receiverId, message) {
  try {
    // create a message
    console.log('Creating a new message');
    const newMessage = new Message({
      message,
      sender: senderId,
    });
    try {
      const result = await newMessage.save();

      // Add new message to the users conversation
      const conversationId = createConversationId(senderId, receiverId);

      await Conversation.findOneAndUpdate(
        { myId: conversationId },
        { $push: { messages: result._id } },
        { new: true },
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  createConversation,
  getConversationsForUser,
  updateConversation,
};
