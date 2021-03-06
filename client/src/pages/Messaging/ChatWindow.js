import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Avatar,
  Typography,
  makeStyles,
  Paper,
  Divider,
  InputBase,
  Button as CopyButton,
} from '@material-ui/core';

import Button from '../../components/Button';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import MessageBubble from './MessageBubble';

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(3),
    width: '50px',
    height: '50px',
  },
  chattingWithInfo: {
    display: 'flex',
    margin: theme.spacing(1),
    alignItems: 'center',
  },
  messagesArea: {
    height: '80%',
    overflow: 'scroll',
  },
  typeArea: {
    display: 'flex',
    height: '20%',
    alignItems: 'center',
  },
  textInput: {
    width: '80%',
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    fontSize: '18px',
  },
  copyIcon: {
    margin: theme.spacing(2),
    color: theme.appTheme.icon,
  },
  sendMessage: {
    height: '40%',
    margin: theme.spacing(2),
    padding: theme.spacing(1),
    fontSize: '15px',
  },
  chatPane: {
    display: 'flex',
    flexDirection: 'column',
    width: '70%',
  },
}));

const ChatWindow = ({ chat, submitMessage, currentUser }) => {
  const [message, setMessage] = useState(''); //message that the user types

  // copy to clipboard
  const textArea = useRef(null);

  const copyToClipBoard = (e) => {
    textArea.current.select();
    document.execCommand('copy');
    e.target.focus();
  };

  // to scroll down to the latest message
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chat.messages]);

  // send message on press enter
  const handleKeyPress = () => {
    submitMessage(chat.receiverId, message);
    setMessage('');
  };

  const classes = useStyles();
  return (
    <Paper className={classes.chatPane}>
      <Box className={classes.chattingWithInfo}>
        <Avatar src={chat.avatar} className={classes.avatar}>
          {chat.name[0]}
        </Avatar>
        <Box>
          <Typography variant="caption">{chat.name}</Typography>
          <Typography variant="h6">{chat.location}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box className={classes.messagesArea}>
        {chat.messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message.message}
            bubbleType={message.sender === currentUser ? 'sender' : 'receiver'}
          />
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Divider />
      <Box className={classes.typeArea}>
        <InputBase
          inputRef={textArea}
          placeholder="Type your message"
          className={classes.textInput}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyPress={(event) =>
            event.key === 'Enter' ? handleKeyPress() : null
          }
        />
        <CopyButton onClick={(e) => copyToClipBoard(e)}>
          <FileCopyOutlinedIcon className={classes.copyIcon} />
        </CopyButton>
        <Button
          onClick={() => {
            setMessage('');
            submitMessage(chat.receiverId, message);
          }}
          className={classes.sendMessage}
        >
          Submit
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatWindow;
