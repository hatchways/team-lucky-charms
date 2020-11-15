import React, { useEffect, useContext, useCallback } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { Route, Switch } from "react-router-dom";

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

function App() {

const { dispatch } = useContext(userState);

const getAuthenticatedUser = useCallback(async () => {
  try {
    const result = await fetch("/getuser", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const user = await result.json();
    if (!user.errors) {
      dispatch({ type: LOADING_USER, payload: user.user });
    }
  } catch (error) {}
}, [dispatch]);

useEffect(() => {
  getAuthenticatedUser();
}, [getAuthenticatedUser]);

  return (
    <MuiThemeProvider theme={theme}>
      <Route component={Navbar} />
      <Switch>
        <Route path="/" exact component={Explore} />
        <Route path="/explore" exact component={Explore} />
        <ProtectedRoutes path="/launch" exact component={Launch} />
        <ProtectedRoutes path="/profile" exact component={Profile} />
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="*" component={() => "Page not found"} />
      </Switch>
    </MuiThemeProvider>
  );
}

export default App;