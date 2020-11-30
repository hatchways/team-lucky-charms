import React, { useContext, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Avatar, Button, Menu, MenuItem, makeStyles } from '@material-ui/core';
import isEmpty from 'is-empty';

// SOCKETS
import { disconnectClient } from '../../socketio-client';

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
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    state: { user },
    dispatch,
  } = useContext(userState);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
    handleClose();
  };

  return (
    <div>
      <NavLink color="inherit" to="/explore" className={classes.link}>
        Explore
      </NavLink>
      <NavLink color="inherit" to="/launch" className={classes.link}>
        Launch
      </NavLink>
      <Button
        aria-controls="profile"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Avatar alt="User" src={!isEmpty(user.avatar) ? user.avatar : null}>
          {user.name[0]}
        </Avatar>
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          component={NavLink}
          to={`/users/${user._id}`}
          onClick={handleClose}
        >
          Profile
        </MenuItem>
        <MenuItem component={NavLink} to={`/messages`} onClick={handleClose}>
          Messages
        </MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default AuthenticatedNav;
