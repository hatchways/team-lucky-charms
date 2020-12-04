import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

// ASSETS
import logo from '../../assets/images/logos/logo.png';

// CONTEXT
import { userState } from '../../provider/UserContext';

// COMPONENTS
import AuthenticatedNav from './AuthenticatedNav';
import UnauthenticatedNav from './UnauthenticatedNav';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    textDecoration: 'none',
    color: 'black',
    width: 'auto',
    display: 'flex',
    justifyContent: 'center',
  },
  logo: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    marginLeft: 10,
    marginRight: 10,
  },
  siteName: {
    fontSize: '18px',
    color: '#000',
    fontWeight: 500,
  },
  toolbar: {
    display: 'flex',
    zIndex: 10,
    justifyContent: 'space-between',
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const {
    state: { isAuthenticated },
  } = useContext(userState);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar className={classes.toolbar}>
          <Grid component={NavLink} to="/" className={classes.title}>
            <img className={classes.logo} src={logo} alt="logo" />
            <Typography className={classes.siteName}>Product Launch</Typography>
          </Grid>

          {isAuthenticated ? (
            <AuthenticatedNav />
          ) : (
            <UnauthenticatedNav />
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;