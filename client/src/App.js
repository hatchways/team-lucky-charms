import React, { useEffect, useContext } from 'react';
import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { theme } from './themes/theme';
import './App.css';
import Explore from './pages/Explore';
import Navbar from './components/Navbar/Navbar';
import Launch from './pages/Launch';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ProtectedRoutes from './routes/ProtectedRoutes';
import { userState } from './provider/UserContext';
import { LOADING_USER, UNAUTH_USER } from './provider/constants';
import Loader from './components/Loader';
import FundingPayment from './components/Funding/Payments';

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
              <ProtectedRoutes path="/launch" exact component={Launch} />
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
