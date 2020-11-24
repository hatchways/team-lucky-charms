import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';

// COMPONENTS
import Project from '../components/Project';
import Sidebar from '../components/Profile/Sidebar';

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
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [projects, setProjects] = useState([]);

  const getProjects = async () => {
    try {
      const response = await fetch(`/api/projects/${userId}`);
      const projects = await response.json();
      setProjects(projects);
    } catch (error) {
      console.log(error);
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
      .finally(() => setIsLoading(false));
  };

  const handleCurrentUser = () => {
    setIsLoading(true);
    getProjects();
    if (isAuthenticated && userId === authUser._id) {
      setIsOwnProfile(true);
      setCurrentUser(authUser);
      setIsLoading(false);
    } else {
      setIsOwnProfile(false);
      getUser();
    }
  };

  useEffect(() => {
    handleCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, authUser]);

  if (errors) {
    return (
      <div className={classes.container}>
        <h1>Error retrieving user profile</h1>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      {isLoading ? (
        // TODO: Create nicer looking loading (placeholders, etc.)
        <h1>Loading...</h1>
      ) : (
        <>
          <Sidebar isOwnProfile={isOwnProfile} user={currentUser} />
          <Box className={classes.main}>
            <Typography
              element="h1"
              variant="h1"
              className={classes.mainHeader}
            >
              Created Projects:
            </Typography>
            <Grid container spacing={3} className={classes.projects}>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <Project key={project._id} data={project} />
                ))
              ) : (
                <h1>No projects created yet</h1>
              )}
            </Grid>
          </Box>
        </>
      )}
    </div>
  );
};

export default Profile;
