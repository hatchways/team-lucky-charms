import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '12px',
    fontWeight: '500',
  },
  date: {
    fontSize: '10px',
    color: '#aaa',
  },
  noNew: {
    fontWeight: '400',
  },
  notification: {
    borderBottom: '1px solid #ddd',
    padding: theme.spacing(1),
  },
  popover: {
    maxWidth: '25vw',
  },
}));

const NotificationsCenter = ({ anchorEl, handleClose, notifications }) => {
  const classes = useStyles();

  return (
    <Popover
      anchorEl={anchorEl}
      id="notifications-popover"
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <div className={classes.popover}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div className={classes.notification} key={notification._id}>
              <Typography className={classes.title}>
                Someone has recently funded your project!
              </Typography>
              <Typography className={classes.date} variant="subtitle2">
                {dayjs(notification.createdAt).fromNow()}
              </Typography>
            </div>
          ))
        ) : (
          <div className={classes.notification}>
            <Typography variant="subtitle1" className={classes.noNew}>
              No new notifications
            </Typography>
          </div>
        )}
      </div>
    </Popover>
  );
};

export default NotificationsCenter;
