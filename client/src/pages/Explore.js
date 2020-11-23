import {
  Container,
  Typography,
  makeStyles,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
} from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import DateRangeIcon from '@material-ui/icons/DateRange';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import React, { useEffect, useState, useContext } from 'react';
import Project from '../components/Project';
import { userState } from './../provider/UserContext';
import axios from 'axios';

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
  const {
    state: { user },
  } = useContext(userState);
  const id = user ? user._id : '';
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({
    industry: '',
    location: '',
    deadline: new Date().toISOString().split('T')[0],
    id: id,
  });
  const classes = useStyles();

  const updateFilters = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  console.log(filters);

  useEffect(() => {
    const getProjects = async () => {
      const result = await axios.post(
        '/api/projects/filteredProjects',
        filters,
      );
      console.log(result.data);
      const projects = result.data;
      if (!projects.errors) {
        setProjects(projects);
        console.log(projects);
      }
      if (projects.errors) {
        console.log('errrorrr');
      }
    };
    getProjects();
  }, [filters]);
  return (
    <Container component="main" maxWidth="xl" className={classes.container}>
      <Typography component="h1" variant="h3">
        Explore Projects
      </Typography>
      <Grid container justify="center" className={classes.filter}>
        <TextField
          className={classes.margin}
          id="industry"
          label="Industry"
          variant="outlined"
          size="small"
          margin="dense"
          name="industry"
          value={filters.industry}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <LocationCityIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => updateFilters('industry', e.target.value)}
        />
        <TextField
          className={classes.margin}
          id="location"
          label="Location"
          variant="outlined"
          size="small"
          margin="dense"
          name="location"
          value={filters.location}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => updateFilters('location', e.target.value)}
        />
        <TextField
          className={classes.margin}
          id="date"
          label="Fundraise Deadline"
          variant="outlined"
          margin="dense"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={filters.deadline}
          onChange={(e) => updateFilters('deadline', e.target.value)}
        />
      </Grid>
      <Grid container spacing={3} className={classes.projects}>
        {projects.length > 1
          ? projects.map((project) => (
              <Project key={project._id} data={project} gridSize={4} />
            ))
          : <Typography>No Projects to show</Typography>}
      </Grid>
    </Container>
  );
};

export default Explore;
