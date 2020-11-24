import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Box, Grid, makeStyles, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';

// COMPONENTS
import Project from '../components/Project';
import Button from '../components/Button';
import TextBubble from '../components/TextBubble';

// ASSETS
import investor from '../assets/images/investor.png';
import linkedin from '../assets/images/linkedin-icon.png';
import angellist from '../assets/images/angellist-icon.png';
import projects from '../data/testing/projects';

// CONTEXT
import { userState } from '../provider/UserContext';

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: '100px',
    margin: theme.spacing(4, 0, 2, 0),
    width: '100px',
  },
  container: {
    display: 'flex',
    minHeight: 'calc(100vh - 64px)',
    position: 'relative',
  },
  description: {
    fontWeight: '500',
    margin: theme.spacing(2, 0),
    textAlign: 'center',
    width: '70%',
  },
  location: {
    color: '#999',
    margin: theme.spacing(1, 0),
  },
  main: {
    flex: 3,
    padding: theme.spacing(8),
  },
  mainHeader: {
    fontSize: '40px',
    fontWeight: '600',
    paddingLeft: '12px',
  },
  metaFooter: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2, 0),
  },
  userMeta: {
    alignItems: 'center',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2, 0),
  },
  projects: {
    margin: theme.spacing(8, 0),
  },
  sidebar: {
    backgroundColor: '#fff',
    flex: 1.3,
  },
  socialIcons: {
    display: 'flex',
    margin: theme.spacing(8, 0, 2, 0),
  },
  socialIcon: {
    height: '40px',
    margin: theme.spacing(0, 1),
    width: '40px',
  },
  subheader: {
    fontSize: '16px',
    fontWeight: '600',
    marginTop: theme.spacing(2),
  },
  textBubbles: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing(2, 0),
  },
  userName: {
    fontSize: '24px',
    fontWeight: '600',
  },
}));

const Profile = () => {
  const {
    state: { user: authUser, isAuthenticated },
  } = useContext(userState);
  const { userId } = useParams();
  const classes = useStyles();
  const [currentUser, setCurrentUser] = useState({ _id: null });
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  const handleCurrentUser = (response) => {
    setLoading(true);
    if (isAuthenticated && userId === authUser._id) {
      setIsOwnProfile(true);
      setCurrentUser(authUser);
      setLoading(false);
    } else {
      setIsOwnProfile(false);
      getUser();
    }
  };

  const getUser = async () => {
    await fetch(`/api/users/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((response) => {
        setCurrentUser(response);
      })
      .catch((error) => {
        setErrors(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (errors) {
    return (
      <div className={classes.container}>
        <h1>Error retrieving user profile</h1>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      {loading ? (
        // TODO: Create nicer looking loading (placeholders, etc.)
        <h1>Loading...</h1>
      ) : (
        <>
          <Box className={classes.sidebar}>
            <Box className={classes.userMeta}>
              <Avatar alt="User" src={investor} className={classes.avatar} />
              <Typography element="h1" className={classes.userName}>
                {currentUser.name}
              </Typography>
              <Typography
                element="h2"
                variant="subtitle1"
                className={classes.location}
              >
                Toronto, Canada
              </Typography>
              <Button outlined={isOwnProfile}>
                {isOwnProfile ? 'Edit Profile' : 'Send Message'}
              </Button>
              <Typography
                element="p"
                variant="subtitle1"
                className={classes.description}
              >
                My interests focus on the role of technology in enhancing
                organizational effectiveness.
              </Typography>
              <Typography element="h3" className={classes.subheader}>
                Expertise:
              </Typography>
              <Box className={classes.textBubbles}>
                <TextBubble outlined>Marketing</TextBubble>
                <TextBubble outlined>Sales</TextBubble>
                <TextBubble outlined>Technology</TextBubble>
              </Box>
            </Box>
            <Box className={classes.metaFooter}>
              <Typography className={classes.subheader}>
                Looking to invest in:
              </Typography>
              <Box className={classes.textBubbles}>
                <TextBubble>Technology</TextBubble>
              </Box>
              <Box className={classes.socialIcons}>
                <Avatar
                  className={classes.socialIcon}
                  src={linkedin}
                  alt="social-media"
                />
                <Avatar
                  className={classes.socialIcon}
                  src={angellist}
                  alt="social-media"
                />
              </Box>
            </Box>
          </Box>
          <Box className={classes.main}>
            <Typography
              element="h1"
              variant="h1"
              className={classes.mainHeader}
            >
              Invested in:
            </Typography>
            <Grid container spacing={3} className={classes.projects}>
              {projects.map((project) => (
                // TODO: change the key to project ID when fetching real projects
                <Project key={project.title} data={project} gridSize={6} />
              ))}
            </Grid>
          </Box>
        </>
      )}
    </div>
  );
};

export default Profile;
