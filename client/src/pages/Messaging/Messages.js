import React, { useState, useEffect, useContext } from 'react';

//material ui
import { makeStyles, Paper, Grid } from '@material-ui/core';

//components
import ChatCard from './ChatCard';
import ChatWindow from './ChatWindow';

//socket & rrd
import { sendMessage, setInbound } from '../../socketio-client';

//context
import { userState } from '../../provider/UserContext';

//Immutable.js
import { Map as IMap } from 'immutable';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    height: 'calc(100vh - 66px)',
  },
  conversationsPane: {
    display: 'flex',
    flexDirection: 'column',
    width: '30%',
    zIndex: '2',
    padding: theme.spacing(2),
  },
  avatar: {
    margin: theme.spacing(3),
    width: '50px',
    height: '50px',
  },
  text: {
    padding: theme.spacing(1),
  },
  conversationsList: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(3, 0),
  },
}));

const Messages = () => {
  const classes = useStyles();
  const [conversations, setConversations] = useState(); // list of user conversations
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [currentUserChat, setCurrentUserChat] = useState();

  const {
    state: { user },
  } = useContext(userState); // currently logged in user

  const transformConversations = (conversationsList) => {
    let conversationsMap = new Map();
    conversationsList.forEach((conversation) => {
      conversationsMap.set(conversation.users[0]._id, {
        _id: conversation._id,
        receiverId: conversation.users[0]._id,
        name: conversation.users[0].name,
        avatar: conversation.users[0].avatar,
        location: conversation.users[0].location,
        messages: conversation.messages,
        createdAt: conversation.createdAt,
      });
    });
    return IMap(Array.from(conversationsMap));
  };
  // load all conversations for the user
  useEffect(() => {
    const loadUserConversations = async () => {
      try {
        const response = await fetch(`/api/users/${user._id}/conversations`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const conversationsList = await response.json();
        const conversationsMap = transformConversations(conversationsList);

        setConversations(conversationsMap);
      } catch (error) {
        console.log(error);
      }
    };
    loadUserConversations();
  }, [user._id]);

  const updateConversation = (conversationKey, newMessage) => {
    // push the new message in user conversation
    if (conversations) {
      const updatedConversation = conversations.updateIn(
        [conversationKey, 'messages'],
        (messages) => [...messages, newMessage],
      );

      setConversations(updatedConversation);
    }
  };

  const submitMessage = (receiverId, message) => {
    sendMessage(user._id, receiverId, message); // sends message through socketio

    const newMessage = {
      message,
      sender: user._id,
      _id: Math.random(),
      createdAt: Date.now(),
    };
    updateConversation(receiverId, newMessage);
  };

  const onMessageReceived = (newMessage) => {
    updateConversation(newMessage.sender, newMessage);
  };

  useEffect(() => {
    setInbound(onMessageReceived); // keeps listening for incoming messages
  });

  return (
    <Paper className={classes.container}>
      <Paper className={classes.conversationsPane}>
        <h1>Messages</h1>
        <Grid className={classes.conversationsList}>
          {conversations &&
            Array.from(conversations).map(([receiverId, conversation]) => (
              <>
                <span
                  onClick={() => {
                    setShowChatWindow(true);
                    setCurrentUserChat(receiverId);
                  }}
                >
                  <ChatCard
                    key={conversation._id}
                    receiverName={conversation.name}
                    latestMessage={
                      conversation.messages[conversation.messages.length - 1]
                    }
                  />
                </span>
              </>
            ))}
        </Grid>
      </Paper>

      {showChatWindow ? (
        <ChatWindow
          chat={conversations.get(currentUserChat)}
          submitMessage={submitMessage}
          currentUser={user._id}
        />
      ) : null}
    </Paper>
  );
};
export default Messages;
