import React from 'react';

import { Avatar, Box, makeStyles, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(3),
    width: '50px',
    height: '50px',
  },
  card: {
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(1, 2),
  },
}));

const ChatCard = ({ receiverName, latestMessage }) => {
  const classes = useStyles();
  return (
    <>
      <Paper className={classes.card} elevation={4}>
        <Avatar className={classes.avatar} />
        <Box className={classes.contactInfo}>
          <Typography variant="caption">{receiverName}</Typography>
          <Typography variant="h6">
            {latestMessage && latestMessage.message}
          </Typography>
        </Box>
      </Paper>
    </>
  );
};

export default ChatCard;
