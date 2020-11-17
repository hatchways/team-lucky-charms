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
      render={(props) => {
        if  (!isAuthenticated) {
          return (
            <Redirect
              to='/login'
            />
          );
        }
         return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoutes;
