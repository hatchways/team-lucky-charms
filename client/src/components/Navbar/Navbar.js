import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Grid, Avatar, Button } from '@material-ui/core';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { NavLink, useHistory } from 'react-router-dom';

import logo from "../../assets/images/logos/logo.png";
import user from "../../assets/images/user.png";
import { userState } from "../../provider/UserContext";
import { LOGOUT_USER } from "../../provider/constants";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textDecoration: 'none',
    color: 'black',
  },
  logo: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    animation: '',
    marginLeft: 10,
    marginRight: 10,
  },
  link: {
    textDecoration: 'none',
    fontSize: 12,
    color: 'black',
    alignItems: 'center',
    margin: '0 1rem',
    textTransform: 'uppercase',
    fontWeight: 500,
    '&.active': {
      borderBottom: '2px solid',
      borderBottomColor: '#69E781',
    },
  },
  toolbar: {
    display: 'flex',
    zIndex: 10,
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory();
  const {
    state: { isAuthenticated },
    dispatch,
  } = useContext(userState);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    dispatch({ type: LOGOUT_USER });
    fetch('/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    history.push('/login');
    handleClose();
  };

  const renderNavbarLoggedUser = () => (
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
        <Avatar alt="User" src={user} />
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem component={NavLink} to="/profile" onClick={handleClose}>
          Profile
        </MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );

  const renderNavbarNotLoggedUser = () => (
    <div>
      <NavLink color="inherit" to="/explore" className={classes.link}>
        Explore
      </NavLink>
      <NavLink color="inherit" to="/login" className={classes.link}>
        Login
      </NavLink>
      <NavLink color="inherit" to="/signup" className={classes.link}>
        Sign Up
      </NavLink>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar className={classes.toolbar}>
          <Grid component={NavLink} to="/">
            <img className={classes.logo} src={logo} alt="logo" />
          </Grid>
          <Typography
            component={NavLink}
            to="/"
            variant="h6"
            className={classes.title}
          >
            Product Launch
          </Typography>

          {isAuthenticated
            ? renderNavbarLoggedUser()
            : renderNavbarNotLoggedUser()}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;