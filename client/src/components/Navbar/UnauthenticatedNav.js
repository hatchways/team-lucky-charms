import React from 'react';
import { makeStyles } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

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

const UnauthenticatedNav = () => {
  const classes = useStyles();

  return (
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
};

export default UnauthenticatedNav;
