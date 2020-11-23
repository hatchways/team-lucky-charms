import React, { useState, useContext } from 'react';
import {
  Avatar,
  Box,
  CircularProgress,
  InputLabel,
  makeStyles,
  Modal,
  TextField,
  Typography,
} from '@material-ui/core';
import isEmpty from 'is-empty';

import { UPDATED_USER } from '../../provider/constants';
import { userState } from '../../provider/UserContext';
import Button from '../Button';

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: '60px',
    width: '60px',
    fontSize: '30px',
    cursor: 'pointer',
    margin: '0 auto',
    marginBottom: theme.spacing(1),
  },
  box: {
    margin: theme.spacing(2, 0),
  },
  center: {
    textAlign: 'center',
  },
  content: {
    backgroundColor: '#fff',
    boxShadow:
      '0 0.1px 1.5px rgba(0, 0, 0, 0.028), 0 0.4px 4.9px rgba(0, 0, 0, 0.042), 0 2px 22px rgba(0, 0, 0, 0.07)',
    // borderRadius: '10px',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vw',
    height: '80vh',
    overflowY: 'scroll',
    padding: theme.spacing(2),
    position: 'absolute',
  },
  form: {},
  header: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: theme.spacing(2, 0),
  },
}));

// TODO: create loading spinner
const EditProfileModal = ({ open, onCancel }) => {
  const {
    dispatch,
    state: { user },
  } = useContext(userState);
  const [name, setName] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const classes = useStyles();

  const checkIfUpdated = (data) => {
    const payload = {};

    if (!isEmpty(data.name)) payload.name = data.name;
    if (!isEmpty(data.email)) payload.email = data.email;
    if (!isEmpty(data.location)) payload.location = data.location;
    if (!isEmpty(data.aboutMe)) payload.aboutMe = data.aboutMe;

    return payload;
  };

  const handleErrors = (errors) => {
    setErrors(errors);
  };

  const resetInputs = () => {
    setName('');
    setEmail('');
    setLocation('');
    setAboutMe('');
  };

  const onSubmitFormHandler = async () => {
    setIsLoading(true);
    const payload = checkIfUpdated({ name, aboutMe, email, location });

    try {
      const updatedUser = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const response = await updatedUser.json();
      if (!response.errors) {
        dispatch({ type: UPDATED_USER, payload: response });
        resetInputs();
        onCancel();
        setIsLoading(false);
      }
      if (response.errors) {
        handleErrors(response.errors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal open={open} disableBackdropClick>
      <div className={classes.content}>
        <Typography element="h3" className={classes.header}>
          Edit Profile
        </Typography>
        <form className={classes.form}>
          <div style={{ marginBottom: '16px' }}>
            <Box>
              <Avatar
                id="change-avatar"
                alt={user.name[0]}
                className={classes.avatar}
              >
                {user.name[0]}
              </Avatar>
              <InputLabel
                style={{ textAlign: 'center', marginBottom: '16px' }}
                htmlFor="change-avatar"
                id="change-avatar-label"
              >
                Change profile photo
              </InputLabel>
            </Box>
          </div>

          <Box className={classes.box}>
            <TextField
              id="name"
              fullWidth
              label="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              variant="outlined"
            />
          </Box>

          <Box className={classes.box}>
            <TextField
              fullWidth
              id="email"
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              variant="outlined"
            />
          </Box>

          <Box className={classes.box}>
            <TextField
              fullWidth
              id="location"
              label="Location"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
              variant="outlined"
            />
          </Box>

          <Box className={classes.box}>
            <TextField
              fullWidth
              id="aboutMe"
              label="About Me"
              placeholder="Describe yourself"
              multiline
              onChange={(e) => setAboutMe(e.target.value)}
              rows={4}
              value={aboutMe}
              variant="outlined"
            />
          </Box>

          <div>{errors.message}</div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {isLoading ? <CircularProgress /> : null}
          </div>
          <div className={classes.center}>
            <Button margin onClick={onSubmitFormHandler}>
              Submit changes
            </Button>
          </div>
          <div className={classes.center}>
            <Button outlined onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
