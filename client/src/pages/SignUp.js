import React from "react";
import SignupLoginForm from "../components/form";

const SignUp = () => {
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
