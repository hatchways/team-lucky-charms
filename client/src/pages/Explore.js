import {
  Container,
  Typography,
  makeStyles,
  Grid,
  TextField,
  InputAdornment,
  Button,
} from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';

import useDebouncer from './../utils/hooks';
import Project from '../components/Project';
import { userState } from './../provider/UserContext';

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
import React from "react";
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';



const Explore = () => {
  const {
    state: { user },
  } = useContext(userState);
  const id = user ? user._id : '';
  const [projects, setProjects] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({
    industry: '',
    location: '',
    deadline: new Date().toISOString().split('T')[0],
    id: id,
    pagination: 9,
    page: 1,
  });
  const classes = useStyles();
 
  const handleNext = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: totalResults > 0 ? filters.page + 1 : 1,
    }));
  };

  const handlePrev = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: filters.page !== 1 ? filters.page - 1 : 1,
    }));
  };

  const updateFilters = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };
  
  const getProjects = useDebouncer(async (filter) => {
    const result = await axios.post('/api/projects/filteredProjects', filter);
    const projects = result.data.projects;
    if (!projects.errors) {
      setProjects(projects);
      setTotalResults(result.data.total);;;
    }
    if (projects.errors) {
      console.log(projects.errors);
    }
  }, 500);

  useEffect(() => {
    getProjects(filters);
  }, [getProjects, filters]);

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
        {projects.length > 0 ? (
          projects.map((project) => (
            <Project key={project._id} data={project} gridSize={4} />
          ))
        ) : (
          <Typography>No Projects to show</Typography>
        )}
      </Grid>
      <Grid container justify="center">
        <div className={classes.root}>
          <Grid>
            <Button
              style={{ margin: '10px 10px 10px 10px' }}
              type="submit"
              variant="contained"
              color="primary"
              disabled={filters.page === 1 ? true : false}
              onClick={handlePrev}
            >
              Prev
            </Button>
            <Button
              style={{ margin: '10px 10px 10px 10px' }}
              type="submit"
              variant="contained"
              color="primary"
              disabled={totalResults === 0 || totalResults < filters.pagination ? true : false}
              onClick={handleNext}
            >
              Next
            </Button>
          </Grid>
        </div>
      </Grid>
    </Container>
  );
};

export default Explore;
