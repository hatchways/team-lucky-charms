import React from "react";
import Form from "../components/form";

const SignUp = () => {
  return (
    <Form
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
