import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { userState } from "../provider/UserContext";

const ProtectedRoutes = ({ component: Component, ...rest }) => {
  const {
    state: { isAuthenticated },
  } = useContext(userState);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/login" }} />
        )
      }
    />
  );
};

export default ProtectedRoutes;
