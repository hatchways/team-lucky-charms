import React from "react";
import Form from "../components/form";

const SignUp = () => {
  return (
    <Form
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
