import React from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Avatar, Box, makeStyles, Paper, Typography } from '@material-ui/core';

dayjs.extend(relativeTime);

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
  date: {
    marginLeft: 'auto',
    padding: theme.spacing(0, 3),
    marginRight: theme.spacing(2),
  },
}));

const ChatCard = ({ receiverName, avatar, createdAt, latestMessage }) => {
  const classes = useStyles();

  return (
    <>
      <Paper className={classes.card} elevation={4}>
        <Avatar src={avatar} className={classes.avatar} />
        <Box>
          <Typography variant="caption">{receiverName}</Typography>
          <Typography variant="h6">
            {latestMessage && latestMessage.message}
          </Typography>
        </Box>
        <Typography className={classes.date} variant="h6">
          {dayjs(createdAt).format('DD/MM/YYYY')}
        </Typography>
      </Paper>
    </>
  );
};

export default ChatCard;
