import React from 'react';
import {
  makeStyles,
  Grid,
  Paper,
  Typography,
  Container,
  Box,
  Divider,
  Avatar,
} from '@material-ui/core';
import Carousel from 'react-material-ui-carousel';

//components
import Button from '../components/Button';
import TextBubble from './TextBubble';

//assets
import avatar from '../assets/images/user.png';

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(3, 3, 1, 3),
  },
  button: {
    margin: theme.spacing(1, 0),
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(5, 0),
  },
  container: {
    marginBottom: theme.spacing(4),
    boxShadow:
      '0 0px 16.5px rgba(0, 0, 0, 0.08), 0 0px 132px rgba(0, 0, 0, 0.16)',
  },
  description: {
    fontWeight: '500',
    margin: theme.spacing(2, 2),
    padding: theme.spacing(2, 2),
  },
  divider: {
    width: '1px',
    height: '100px',
    borderColor: theme.appTheme.divider,
  },
  funding: {
    justifyContent: 'center',
    flexDirection: 'row',
    display: 'flex',
  },
  fundingDetails: {
    display: 'flex',
    alignItems: 'center',
  },
  heading: {
    textAlign: 'center',
    marginTop: theme.spacing(5),
  },
  media: {
    width: '100%',
  },
  numbers: {
    padding: theme.spacing(3, 1, 3, 0),
    margin: theme.spacing(2, 0, 2, 0),
  },
  title: {
    marginTop: theme.spacing(3),
  },
  projectDetails: {
    padding: '10px',
    margin: theme.spacing(7, 0, 0, 2),
  },
  stats: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(2, 0, 2, 0),
    padding: theme.spacing(2, 0, 2, 0),
  },
  subtitle: {
    fontSize: '18px',
    marginTop: theme.spacing(2),
  },
  textHeading: {
    fontSize: '22px',
    fontWeight: '600',
    margin: theme.spacing(2, 2),
    padding: theme.spacing(2, 2),
  },
  userDetails: {
    padding: '10px',
    margin: theme.spacing(7, 5, 0, 5),
    textAlign: 'center',
  },
  userInfo: {
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',
  },
  userName: {
    fontSize: '24px',
    fontWeight: '600',
  },
}));

const IndividualProject = ({ project, user }) => {
  const {
    title,
    subtitle,
    description,
    images,
    fundingGoal,
    investors,
    industry,
    location,
  } = project;
  const { name } = user;

  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <div className={classes.heading}>
        <TextBubble>{industry}</TextBubble>
        <Typography component="h2" variant="h3" className={classes.title}>
          {title}
        </Typography>
        <Typography variant="subtitle1" className={classes.subtitle}>
          {subtitle}
        </Typography>
      </div>

      {/* Left Pane - Project Images, Description */}
      <Grid container>
        <Grid item xs={7} className={classes.projectDetails}>
          <Paper className={classes.container}>
            <Carousel>
              {images.map((image) => (
                <img
                  src={image}
                  alt="Project-thumbnail"
                  className={classes.media}
                />
              ))}
            </Carousel>
            <Typography element="h2" className={classes.textHeading}>
              About
            </Typography>

            <Typography
              element="p"
              variant="subtitle1"
              className={classes.description}
            >
              {description}
            </Typography>
          </Paper>
        </Grid>

        {/* Right Pane - Funding, User Details */}
        <Grid item xs={4} className={classes.userDetails}>
          <Paper className={classes.container}>
            <Box className={classes.funding}>
              <Typography variant="h1" className={classes.numbers}>
                $ 23,476
              </Typography>
              <Typography variant="subtitle2" className={classes.numbers}>
                / {fundingGoal}
              </Typography>
            </Box>
            <Divider />

            {/* Investors and Deadline */}
            <Box className={classes.fundingDetails}>
              <Grid item xs={5} className={classes.stats}>
                <Typography component="h1" variant="h4">
                  {investors.length}
                </Typography>
                <Typography variant="subtitle1">backers</Typography>
              </Grid>
              {/* <Grid item xs={2}>
                <Divider orientation="vertical" />
              </Grid> */}
              <Grid item xs={2}>
                <hr className={classes.divider} />
              </Grid>
              <Grid item xs={5} className={classes.stats}>
                <Typography component="h1" variant="h4">
                  44
                </Typography>
                <Typography variant="subtitle1">days to go</Typography>
              </Grid>
            </Box>
            <Divider />

            {/* User & Buttons */}
            <Box className={classes.userInfo}>
              <Avatar alt="User" src={avatar} className={classes.avatar} />
              <Typography element="h1" className={classes.userName}>
                {name}
              </Typography>
              <Typography
                element="h2"
                variant="subtitle1"
                className={classes.location}
              >
                {location}
              </Typography>
              <Box className={classes.buttons}>
                <Button outlined className={classes.button}>
                  Send Message
                </Button>
                <Button className={classes.button}>Fund This Project</Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default IndividualProject;
