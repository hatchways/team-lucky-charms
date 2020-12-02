import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import {
  Avatar,
  Button,
  Menu,
  MenuItem,
  makeStyles,
  Badge,
} from '@material-ui/core';
import isEmpty from 'is-empty';
import NotificationsIcon from '@material-ui/icons/Notifications';

// COMPONENTS
import NotificationsCenter from './NotificationsCenter';

// SOCKETS
import {
  disconnectClient,
  getNewNotifications,
  markNotificationsRead,
} from '../../socketio-client';

// CONTEXT
import { userState } from '../../provider/UserContext';
import { LOGOUT_USER } from '../../provider/constants';

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    fontSize: 12,
    color: 'black',
    margin: '0 1rem',
    textTransform: 'uppercase',
    fontWeight: 500,
    '&.active': {
      borderBottom: '2px solid',
      borderBottomColor: theme.palette.primary.main,
    },
    '&:hover': {
      color: 'grey',
      background: 'transparent',
    },
  },
}));

const AuthenticatedNav = () => {
  const history = useHistory();
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [badge, setBadge] = useState(0);
  const {
    state: { user },
    dispatch,
  } = useContext(userState);

  const handleAvatarClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const markReadSuccess = () => {
    setBadge(0);
  }

  const handleNotificationsClose = () => {
    if (notifications.length !== 0) {
      markNotificationsRead(notifications, markReadSuccess);
    }
    setNotificationsAnchorEl(null);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };
  const classes = useStyles();

  const logout = () => {
    dispatch({ type: LOGOUT_USER });
    fetch('/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    disconnectClient();
    history.push('/login');
  };

  const updateNotifications = (newNotifications) => {
    setNotifications(newNotifications);
    if (isNaN(newNotifications.length)) {
      setBadge(0);
      return;
    }
    setBadge(newNotifications.length);
  };

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications/${user._id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const userNotifications = await response.json();
        updateNotifications(userNotifications);
      } catch (error) {
        console.log(error);
      }
    };
    // get notifications from when not logged in
    getNotifications();
    // using sockets to get live notification updates
    getNewNotifications(updateNotifications);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <NavLink color="inherit" to="/explore" className={classes.link}>
        Explore
      </NavLink>
      <NavLink color="inherit" to="/launch" className={classes.link}>
        Launch
      </NavLink>
      <Button
        aria-controls="notifications"
        aria-haspopup="true"
        onClick={handleNotificationsClick}
      >
        <Badge badgeContent={badge} color="error">
          <NotificationsIcon />
        </Badge>
      </Button>
      <NotificationsCenter
        handleClose={handleNotificationsClose}
        anchorEl={notificationsAnchorEl}
        notifications={notifications}
      />
      <Button
        aria-controls="profile"
        aria-haspopup="true"
        onClick={handleAvatarClick}
      >
        <Avatar alt="User" src={!isEmpty(user.avatar) ? user.avatar : null}>
          {user.name[0]}
        </Avatar>
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={profileAnchorEl}
        keepMounted
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileClose}
      >
        <MenuItem
          component={NavLink}
          to={`/users/${user._id}`}
          onClick={handleProfileClose}
        >
          Profile
        </MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default AuthenticatedNav;
