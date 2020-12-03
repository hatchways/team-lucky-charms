import React, { useEffect, useContext } from 'react';
import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import './App.css';

// THEME
import { theme } from './themes/theme';

// PAGES
import Explore from './pages/Explore';
import Launch from './pages/Launch';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Messages from './pages/Messaging/Messages';
import ProjectDetails from './pages/ProjectDetails';
import EditProject from './pages/EditProject';

// ROUTES
import ProtectedRoutes from './routes/ProtectedRoutes';

// COMPONENTS
import Navbar from './components/Navbar/Navbar';
import Loader from './components/Loader';
import FundingPayment from './components/Funding/Payments';

// CONTEXT
import { userState } from './provider/UserContext';
import { LOADING_USER, UNAUTH_USER } from './provider/constants';

// SOCKETS
import { connectClient } from './socketio-client';

function App() {
  const {
    dispatch,
    state: { loading },
  } = useContext(userState);
  const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY);

  useEffect(() => {
    const getAuthenticatedUser = async () => {
      const result = await fetch('/getuser', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const user = await result.json();
      if (!user.errors) {
        connectClient();
        dispatch({ type: LOADING_USER, payload: user.user });
      }
      if (user.errors) {
        dispatch({ type: UNAUTH_USER });
      }
    };
    getAuthenticatedUser();
  }, [dispatch]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Elements stripe={stripePromise}>
          <Navbar />
          {loading ? (
            <Loader />
          ) : (
            <Switch>
              <Redirect exact from="/" to="/login" />
              <Route path="/explore" exact component={Explore} />
              <Route path="/login" exact component={Login} />
              <Route path="/signup" exact component={SignUp} />
              <Route path="/users/:userId" component={Profile} />
              <Route path="/project/:projectId" component={ProjectDetails} />
              <Route path="/edit-project/:projectId" component={EditProject} />
              <ProtectedRoutes path="/messages" component={Messages} />
              <ProtectedRoutes exact path="/launch" component={Launch} />
              {/* need suggestion for this route name be payments or funds */}
              <ProtectedRoutes
                path="/payments"
                exact
                component={FundingPayment}
              />
              <Route path="*" component={() => 'Page not found'} />
            </Switch>
          )}
        </Elements>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;