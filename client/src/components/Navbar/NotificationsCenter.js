import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '12px',
  },
  date: {
    fontSize: '10px',
    color: '#aaa',
  },
  notification: {
    borderBottom: '1px solid #ddd',
    padding: theme.spacing(1),
  },
  popover: {
    maxWidth: '25vw',
  },
}));

const NotificationsCenter = ({ anchorEl, handleClose }) => {
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
        <div className={classes.notification}>
          <Typography className={classes.title} variant="subtitle1">Someone has recently funded your project!</Typography>
          <Typography className={classes.date} variant="subtitle2">5 minutes ago</Typography>
        </div>
        <div className={classes.notification}>
          <Typography className={classes.title} variant="subtitle1">Someone has recently funded your project!</Typography>
          <Typography className={classes.date} variant="subtitle2">1 hour ago</Typography>
        </div>
        <div className={classes.notification}>
          <Typography className={classes.title} variant="subtitle1">Someone has recently funded your project!</Typography>
          <Typography className={classes.date} variant="subtitle2">Yesterday</Typography>
        </div>
      </div>
    </Popover>
  );
};

export default NotificationsCenter;
