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
import { useDropzone } from 'react-dropzone';

// CONTEXT
import { UPDATED_USER } from '../../provider/constants';
import { userState } from '../../provider/UserContext';

// COMPONENTS
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
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vw',
    height: '80vh',
    overflowY: 'scroll',
    padding: theme.spacing(2),
    position: 'absolute',
  },
  dropzone: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    marginBottom: theme.spacing(1),
    '&:hover': {
      cursor: 'pointer',
    },
  },
  error: {
    color: theme.appTheme.warning,
    fontSize: '16px',
  },
  header: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: theme.spacing(2, 0),
  },
  removePhoto: {
    marginTop: theme.spacing(1),
    '&:hover': {
      cursor: 'pointer',
    },
  },
  uploadAvatar: {
    margin: theme.spacing(1, 0),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

// TODO: add picture/avatar upload
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
  const [avatar, setAvatar] = useState(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      handleAddedAvatarImage(acceptedFiles);
    },
  });

  const handleAddedAvatarImage = (images) => {
    const addedImages = images.map((image) =>
      Object.assign(image, { preview: URL.createObjectURL(image) }),
    );
    const firstImage = addedImages[0];
    setAvatar(firstImage);
  };

  const classes = useStyles();

  const checkIfUpdated = (data) => {
    const payload = {};
    if (!isEmpty(data.name)) payload.name = data.name;
    if (!isEmpty(data.email)) payload.email = data.email;
    if (!isEmpty(data.location)) payload.location = data.location;
    if (!isEmpty(data.aboutMe)) payload.aboutMe = data.aboutMe;
    if (!isEmpty(data.avatar)) payload.avatar = data.avatar;

    return {
      isValid: Object.keys(payload).length > 0,
      payload,
    };
  };

  const handleErrors = (errors) => {
    setErrors(errors);
  };

  const resetInputs = () => {
    setName('');
    setEmail('');
    setLocation('');
    setAboutMe('');
    setAvatar(null);
    setErrors(false);
  };

  const onSubmitFormHandler = async () => {
    setIsLoading(true);
    const { isValid, payload } = checkIfUpdated({
      name,
      aboutMe,
      email,
      location,
      avatar,
    });

    if (!isValid) {
      setIsLoading(false);
      setErrors({ message: 'Nothing has been updated' });
      return;
    }

    try {
      if (!isEmpty(payload.avatar)) {
        const formData = new FormData();
        formData.append('images', payload.avatar);
        const response = await fetch(`/api/users/${user._id}/imageUpload`, {
          method: 'POST',
          body: formData,
        });
        const avatarUrls = await response.json();
        payload.avatar = avatarUrls[0];
      }
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

  const onCancelHandler = () => {
    resetInputs();
    onCancel();
  };

  const displayAvatarPreview = () => {
    if (!isEmpty(user.avatar) && isEmpty(avatar)) return user.avatar;
    if (!isEmpty(avatar)) return avatar.preview;
    return null;
  };

  return (
    <Modal open={open}>
      <div className={classes.content}>
        <Typography element="h3" className={classes.header}>
          Edit Profile
        </Typography>
        <form className={classes.form}>
          <Box className={classes.uploadAvatar}>
            <div {...getRootProps({ className: classes.dropzone })}>
              <input {...getInputProps()} />
              <Avatar
                id="change-avatar"
                alt={user.name[0]}
                className={classes.avatar}
                src={displayAvatarPreview()}
              >
                {user.name[0]}
              </Avatar>
            </div>
            <InputLabel htmlFor="change-avatar" id="change-avatar-label">
              Change profile photo
            </InputLabel>
            {!isEmpty(avatar) ? (
              <InputLabel
                htmlFor="delete-avatar"
                id="delete-avatar-button"
                className={classes.removePhoto}
                onClick={() => setAvatar(null)}
              >
                Remove photo
              </InputLabel>
            ) : null}
          </Box>

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

          <Typography align="center" className={classes.error}>
            {errors.message}
          </Typography>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {isLoading ? <CircularProgress /> : null}
          </div>
          <div className={classes.center}>
            <Button margin onClick={onSubmitFormHandler}>
              Submit changes
            </Button>
          </div>
          <div className={classes.center}>
            <Button outlined onClick={onCancelHandler}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
