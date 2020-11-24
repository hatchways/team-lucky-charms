import React, { useContext } from "react";
import SignupLoginForm from "../components/form";
import { userState } from "../provider/UserContext";
import { useHistory } from "react-router-dom";

const SignUp = () => {
  const history = useHistory();
  const {
    state: { isAuthenticated, user },
  } = useContext(userState);
  if (isAuthenticated) {
    history.push(`/users/${user._id}`);
  }
  return (
    <SignupLoginForm
      formName="signup"
      formTitle="Create an account"
      formDesc="Already a member?"
      buttonText="Create Account"
      redirectText="Login"
      formLink="login"
    />
  );
};

export default SignUp;
