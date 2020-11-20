import {
  Container,
  Typography,
  makeStyles,
  Grid,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import DateRangeIcon from '@material-ui/icons/DateRange';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import React, { useEffect, useState } from 'react';
import Project from '../components/Project';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  margin: {
    margin: theme.spacing(1),
  },
  filter: {
    paddingTop: 50,
  },
  projects: {
    margin: theme.spacing(8, 0),
  },
}));

const Explore = () => {
  const [projects, setProjects] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const getProjects = async () => {
      const result = await fetch('/api/projects/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const projects = await result.json();
      if (!projects.errors) {
        setProjects(projects);
        console.log(projects);
      }
      if (projects.errors) {
        console.log('errrorrr');
      }
    };
    getProjects();
  }, []);
  return (
    <Container component="main" maxWidth="xl" className={classes.container}>
      <Typography component="h1" variant="h3">
        Explore Projects
      </Typography>
      <Grid container justify="center" className={classes.filter}>
        <TextField
          className={classes.margin}
          id="outlined-size-small"
          label="Industry"
          variant="outlined"
          size="small"
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <LocationCityIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          className={classes.margin}
          id="outlined-size-small"
          label="Location"
          variant="outlined"
          size="small"
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          className={classes.margin}
          id="outlined-size-small"
          label="Date"
          variant="outlined"
          size="small"
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <DateRangeIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid container spacing={3} className={classes.projects}>
        {projects.map((project) => (
          // TODO: change the key to project ID when fetching real projects
          <Project key={project.title} data={project} gridSize={4} />
        ))}
      </Grid>
    </Container>
  );
};

export default Explore;
