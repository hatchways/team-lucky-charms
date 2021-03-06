import React, { useContext } from 'react';
import SignupLoginForm from '../components/form';
import { userState } from '../provider/UserContext';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const history = useHistory();
  const {
    state: { isAuthenticated, user },
  } = useContext(userState);
  if (isAuthenticated) {
    history.push(`/users/${user._id}`);
  }
  return (
    <SignupLoginForm
      formName="login"
      formTitle="Member login"
      formDesc="New here?"
      buttonText="Login"
      redirectText="Sign up"
      formLink="signup"
    />
  );
};

export default Login;
