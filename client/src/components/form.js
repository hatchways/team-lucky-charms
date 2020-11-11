import React, { useState } from "react";
import {
  Typography,
  Container,
  CssBaseline,
  makeStyles,
  Button,
  Divider,
} from "@material-ui/core";

import { Link } from "react-router-dom";
import TextInput from "./TextInput";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    marginTop: theme.spacing(1),
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  submit: {
    marginTop: theme.spacing(4),
    color: "white",
    height: "4em",
    width: "50%",
    backgroundColor: theme.appTheme.background,
  },
  description: {
    margin: theme.spacing(0.5, 3, 4),
  },
  divider: {
    height: "0.25em",
    width: "8vh",
    margin: "3em",
    backgroundColor: theme.appTheme.background,
  },
  warning: {
    color: theme.appTheme.warning,
  },
}));

const SignupLoginForm = ({
  formTitle,
  formDesc,
  redirectText,
  formLink,
  buttonText,
  formName,
}) => {
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    error: "",
  });

  const classes = useStyles();

  // Input field validation
  const validateFields = () => {
    let isValid = true;

    if (formName === "signup" && name.value === "") {
      setName({ ...name, error: "Name is required" });
      isValid = false;
    }

    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email.value
      )
    ) {
      setEmail({ ...email, error: "Invalid Email" });
      isValid = false;
    }
    if (password.value.length < 6) {
      setPassword({ ...password, error: "Invalid Password" });
      isValid = false;
    }
    if (formName === "signup" && password.value !== confirmPassword.value) {
      setConfirmPassword({
        ...confirmPassword,
        error: "Passwords don't match",
      });
      isValid = false;
    }
    return isValid;
  };

  // on Button Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateFields();

    if (isValid) {
      console.log("Submitted"); // Will replace with API call
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h3">
          {formTitle}
        </Typography>
        <Divider className={classes.divider} />
        <Typography component="h6" className={classes.description}>
          {formDesc}{" "}
          <Link style={{ color: "black" }} to={`/${formLink}`}>
            {redirectText}
          </Link>
        </Typography>
        <form className={classes.form} noValidate>
          {formName === "signup" && (
            <TextInput
              id="name"
              label="Name"
              value={name.value}
              onChange={(e) => setName({ value: e.target.value, error: "" })}
            />
          )}
          <div className={classes.warning}>{name.error}</div>
          <TextInput
            id="email"
            label="Email Address"
            value={email.value}
            onChange={(e) => setEmail({ value: e.target.value, error: "" })}
          />
          <div className={classes.warning}>{email.error}</div>
          <TextInput
            id="filled-password-input"
            label="Password"
            type="password"
            value={password.value}
            onChange={(e) => setPassword({ value: e.target.value, error: "" })}
          />
          <div className={classes.warning}>{password.error}</div>
          {formName === "signup" && (
            <TextInput
              id="confirm-password"
              label="Confirm Password"
              type="password"
              value={confirmPassword.value}
              onChange={(e) =>
                setConfirmPassword({ value: e.target.value, error: "" })
              }
            />
          )}

          <div className={classes.warning}>{confirmPassword.error}</div>

          <Button
            type="submit"
            variant="contained"
            className={classes.submit}
            onClick={(e) => handleSubmit(e)}
          >
            {buttonText}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default SignupLoginForm;
