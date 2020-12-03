import React from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { format as d3Format } from 'd3-format';
import CountUp from 'react-countup';

import TextBubble from './TextBubble';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#fff',
    marginBottom: theme.spacing(4),
    boxShadow:
      '0 0px 16.5px rgba(0, 0, 0, 0.08), 0 0px 132px rgba(0, 0, 0, 0.16)',
  },
  footer: {
    color: '#ccc',
    fontSize: '14px',
    marginTop: theme.spacing(1),
  },
  funding: {
    fontSize: '18px',
    fontWeight: '600',
    margin: theme.spacing(1, 0),
  },
  goal: {
    fontSize: '16px',
    fontWeight: '400',
    color: '#ccc',
  },
  img: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '220px',
    padding: theme.spacing(1.5),
  },
  meta: {
    padding: theme.spacing(2.5, 3.5),
  },
  metaHeader: {
    fontSize: '22px',
    fontWeight: '600',
  },
}));
const Project = ({ data, gridSize }) => {
  const format = d3Format(',');
  const classes = useStyles();
  const { fundingGoal, images, industry, title, investors } = data;
  const totalFunds = investors
    .map((a) => a.amountFunded)
    .reduce((acc, amountFunded) => acc + amountFunded, 0);
  return (
    <Box className={classes.container}>
      <div
        style={{ backgroundImage: `url(${images[0]})` }}
        className={classes.img}
      >
        <TextBubble>{industry}</TextBubble>
      </div>
      <Box className={classes.meta}>
        <Typography element="h2" className={classes.metaHeader}>
          {title}
        </Typography>
        <Typography element="h3" className={classes.funding}>
          {totalFunds ? (
            <CountUp
              start={0}
              end={totalFunds / 100}
              duration={1}
              separator=","
            />
          ) : (
            0
          )}
          <span className={classes.goal}> / {format(fundingGoal)}</span>
        </Typography>
        <Typography element="h4" className={classes.footer}>
          Equity exchange: 10%
          <span style={{ margin: '0 16px' }}>|</span>
          12 days to go
        </Typography>
      </Box>
    </Box>
  );
};

export default Project;
