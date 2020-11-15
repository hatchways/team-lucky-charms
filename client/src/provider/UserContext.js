import React, { createContext, useReducer } from "react";
import {
  LOGOUT_USER,
  LOADING_USER,
  SIGNUP_SUCCESS,
  LOGIN_SUCCESS,
} from "./constants";

const initialState = {
  isAuthenticated: false,
  user: {},
};

const userState = createContext(initialState);
const { Provider } = userState;

const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(({ state }, { type, payload }) => {
    switch (type) {
      case LOADING_USER:
        return {
          ...state,
          user: payload,
          isAuthenticated: true,
        };
      case SIGNUP_SUCCESS:
        return {
          ...state,
          user: payload,
          isAuthenticated: true,
        };
      case LOGIN_SUCCESS:
        return {
          ...state,
          user: payload,
          isAuthenticated: true,
        };
      case LOGOUT_USER:
        return {
          ...state,
          isAuthenticated: false,
          user: null,
        };
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { userState, UserContextProvider };
