import React, { useContext, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  CssBaseline,
  Divider,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  Modal,
  OutlinedInput,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';

// COMPONENTS
import Button from '../components/Button';

// ASSETS
import uploadIcon from '../assets/upload-icon.png';

// CONTEXT
import { userState } from '../provider/UserContext';

const useStyles = makeStyles((theme) => ({
  box: {
    margin: theme.spacing(4, 0),
    alignSelf: 'stretch',
  },
  card: {
    borderRadius: '10px',
    boxShadow:
      '0 0.1px 1.5px rgba(0, 0, 0, 0.028), 0 0.4px 4.9px rgba(0, 0, 0, 0.042), 0 2px 22px rgba(0, 0, 0, 0.07)',
    height: '200px',
    width: '200px',
  },
  cardContent: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  center: {
    textAlign: 'center',
  },
  container: {
    position: 'relative',
  },
  content: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  divider: {
    backgroundColor: theme.appTheme.background,
    height: '0.25em',
    margin: theme.spacing(2, 0),
    width: '8vh',
  },
  dropzone: {
    height: '200px',
    width: '200px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  form: {
    width: '100%',
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  imagePreview: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    borderRadius: '10px',
    height: '100%',
    width: '100%',
    '&:hover': {},
  },
  imagePreviewContainer: {
    position: 'relative',
    height: '84px',
    width: '84px',
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  imagePreviewsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: theme.spacing(4),
  },
  label: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: theme.spacing(1),
  },
  modal: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    backgroundColor: '#fff',
    padding: theme.spacing(1),
    borderRadius: '10px',
  },
  uploadIcon: {
    width: '40%',
    height: '40%',
    margin: theme.spacing(1, 0, 4, 0),
  },
}));

const Launch = () => {
  const classes = useStyles();
  const {
    state: { user },
  } = useContext(userState);
  const [description, setDescription] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [industry, setIndustry] = useState('consumer');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [acceptedImages, setAcceptedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      handleImageDrop(acceptedFiles);
    },
  });

  const handleImageDrop = (images) => {
    const addedImages = images.map((image) =>
      Object.assign(image, { preview: URL.createObjectURL(image) }),
    );

    setAcceptedImages((prev) => [...prev, ...addedImages]);
  };

  const resetInputs = () => {
    setAcceptedImages([]);
    setDescription('');
    setFundingGoal('');
    setIndustry('consumer');
    setLocation('');
    setSubtitle('');
    setTitle('');
  };

  const projectLaunchSuccess = () => {
    resetInputs();
  };

  const onSubmitProject = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const payload = {
      title,
      subtitle,
      description,
      location,
      fundingGoal,
      industry,
      images: [],
      owner: user._id,
    };
    try {
      const formData = new FormData();
      acceptedImages.forEach((image) => {
        formData.append('images', image);
      });
      const response = await fetch('/api/projects/imageUpload', {
        method: 'POST',
        body: formData,
      });
      const images = await response.json();
      payload.images = images;
      const res = await fetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 201) {
        projectLaunchSuccess();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline>
        <div className={classes.content}>
          <Modal open={isLoading} disableBackdropClick>
            <div className={classes.modal}>
              <CircularProgress />
            </div>
          </Modal>
          <Typography component="h1" variant="h1" className={classes.header}>
            Let's get started.
          </Typography>
          <Divider className={classes.divider} />

          <form className={classes.form} onSubmit={(e) => onSubmitProject(e)}>
            <Box className={classes.box}>
              <InputLabel
                htmlFor="project-title"
                id="project-title-label"
                className={classes.label}
              >
                Project Title
              </InputLabel>
              <OutlinedInput
                aria-labelledby="project-title-label"
                id="project-title"
                fullWidth
                placeholder="Name your project"
                onChange={(e) => setTitle(e.target.value)}
                required
                value={title}
                variant="outlined"
              />
            </Box>

            <Box className={classes.box}>
              <InputLabel
                htmlFor="subtitle"
                id="subtitle-label"
                className={classes.label}
              >
                Subtitle
              </InputLabel>
              <OutlinedInput
                aria-labelledby="subtitle-label"
                fullWidth
                id="subtitle"
                placeholder="Add a subtitle"
                onChange={(e) => setSubtitle(e.target.value)}
                required
                value={subtitle}
                variant="outlined"
              />
            </Box>

            <Box className={classes.box}>
              <InputLabel
                className={classes.label}
                htmlFor="description"
                id="description-label"
              >
                Description
              </InputLabel>
              <OutlinedInput
                aria-labelledby="description-label"
                fullWidth
                id="description"
                placeholder="Describe your project"
                multiline
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={8}
                value={description}
                variant="outlined"
              />
            </Box>

            <Box className={classes.box}>
              <InputLabel
                htmlFor="select-industry"
                id="industry-label"
                className={classes.label}
              >
                Industry
              </InputLabel>
              <TextField
                aria-labelledby="select-industry-label"
                fullWidth
                id="select-industry"
                onChange={(e) => setIndustry(e.target.value)}
                select
                value={industry}
                variant="outlined"
              >
                <MenuItem value={'consumer'}>Consumer</MenuItem>
                <MenuItem value={'enterprise'}>Enterprise</MenuItem>
              </TextField>
            </Box>

            <Box className={classes.box}>
              <InputLabel
                htmlFor="location"
                id="location-label"
                className={classes.label}
              >
                Project location
              </InputLabel>
              <OutlinedInput
                aria-labelledby="location-label"
                fullWidth
                id="location"
                placeholder="Enter your project's location"
                onChange={(e) => setLocation(e.target.value)}
                value={location}
                variant="outlined"
              ></OutlinedInput>
            </Box>

            <Box className={classes.box}>
              <InputLabel
                className={classes.label}
                htmlFor="upload-images"
                id="upload-images-label"
                style={{ marginBottom: '20px' }}
              >
                Upload Images
              </InputLabel>

              <div style={{ display: 'flex' }}>
                <div {...getRootProps({ className: classes.dropzone })}>
                  <Card className={classes.card} id="upload-images">
                    <CardContent className={classes.cardContent}>
                      <input {...getInputProps()} />
                      <img
                        alt="upload-icon"
                        className={classes.uploadIcon}
                        src={uploadIcon}
                      />
                      <Typography
                        align="center"
                        component="p"
                        style={{ fontSize: 12, color: '#aaa' }}
                        variant="caption"
                      >
                        Drop an image here or select a file
                      </Typography>
                    </CardContent>
                  </Card>
                </div>

                <div className={classes.imagePreviewsContainer}>
                  {acceptedImages.map((image) => (
                    <div
                      key={image.lastModified}
                      className={classes.imagePreviewContainer}
                    >
                      <div
                        className={classes.imagePreview}
                        style={{
                          backgroundImage: `url(${image.preview})`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Box>

            <Box className={classes.box}>
              <InputLabel
                className={classes.label}
                htmlFor="funding-goal-amount"
                id="funding-goal-label"
              >
                Funding Goal Amount
              </InputLabel>
              <TextField
                aria-labelledby="funding-goal-label"
                fullWidth
                id="funding-goal-amount"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                onChange={(e) => setFundingGoal(e.target.value)}
                placeholder="10000"
                value={fundingGoal}
                variant="outlined"
              />
            </Box>

            <div className={classes.center}>
              <Button onClick={onSubmitProject}>Submit</Button>
            </div>
          </form>
        </div>
      </CssBaseline>
    </Container>
  );
};

export default Launch;
