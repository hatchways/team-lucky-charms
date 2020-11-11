import React from "react";
import SignupLoginForm from "../components/form";

const SignUp = () => {
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

export default SignUp;
