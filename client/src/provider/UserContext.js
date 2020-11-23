import React, { createContext, useReducer } from "react";
import {
  LOGOUT_USER,
  LOADING_USER,
  SIGNUP_SUCCESS,
  LOGIN_SUCCESS,
  UNAUTH_USER,
  UPDATED_USER,
} from './constants';

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: true,
};

const userState = createContext(initialState);
const { Provider } = userState;

const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, { type, payload }) => {
    switch (type) {
      case SIGNUP_SUCCESS:
        return {
          ...state,
          user: payload,
          isAuthenticated: true,
          loading: false,
        };
      case LOGIN_SUCCESS:
        return {
          ...state,
          user: payload,
          isAuthenticated: true,
          loading: false,
        };
      case LOGOUT_USER:
        return {
          ...state,
          isAuthenticated: false,
          user: null,
          loading: false,
        };
      case LOADING_USER:
        return {
          ...state,
          user: payload,
          isAuthenticated: true,
          loading: false,
        };
      case UNAUTH_USER:
        return {
          ...state,
          loading: false,
        };
      case UPDATED_USER:
        return {
          ...state,
          user: payload,
        }
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { userState, UserContextProvider };
