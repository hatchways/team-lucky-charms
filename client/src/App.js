import React, { useEffect, useContext } from 'react';
import { MuiThemeProvider } from "@material-ui/core";
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';

import { theme } from "./themes/theme";
import "./App.css";
import Explore from "./pages/Explore";
import Navbar from "./components/Navbar/Navbar";
import Launch from "./pages/Launch";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import { userState } from "./provider/UserContext";
import { LOADING_USER } from "./provider/constants";
import Loader from './components/Loader';

function App() {
  const { dispatch, state } = useContext(userState);

  useEffect(() => {
    const getAuthenticatedUser = async () => {
      try {
        const result = await fetch('/getuser', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const user = await result.json();
        if (!user.errors) {
          dispatch({ type: LOADING_USER, payload: user.user });
        }
      } catch (error) {}
    };
    getAuthenticatedUser();
  }, [dispatch]);

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar />
        {state.loading ? (
          <Loader />
        ) : (
          <Switch>
            <Redirect exact from="/" to="/explore" />
            <Route path="/explore" exact component={Explore} />
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={SignUp} />
            <ProtectedRoutes path="/launch" exact component={Launch} />
            <ProtectedRoutes path="/profile" exact component={Profile} />
            <Route path="*" component={() => 'Page not found'} />
          </Switch>
        )}
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;