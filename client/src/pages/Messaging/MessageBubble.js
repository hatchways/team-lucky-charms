import React from 'react';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  bubble: {
    width: 'fit-content',
    height: '50px',
    padding: theme.spacing(2),
    margin: theme.spacing(3),
    borderRadius: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sender: {
    marginLeft: 'auto',
    backgroundColor: theme.appTheme.senderBubble,
  },
  receiver: {
    backgroundColor: theme.appTheme.receiverBubble,
    marginRight: 'auto',
  },
}));
const MessageBubble = ({ message, bubbleType }) => {
  const classes = useStyles();
  return (
    <Paper
      className={
        bubbleType === 'sender'
          ? clsx(classes.sender, classes.bubble)
          : clsx(classes.receiver, classes.bubble)
      }
    >
      <Typography variant="body1">{message}</Typography>
    </Paper>
  );
};

export default MessageBubble;
