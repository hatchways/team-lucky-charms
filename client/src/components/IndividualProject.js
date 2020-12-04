import React, { useContext } from 'react';
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
import CountUp from 'react-countup';
import { format as d3format } from 'd3-format';

//components
import Button from '../components/Button';
import TextBubble from './TextBubble';

//methods
import { createOrLoadConversation } from '../pages/Messaging/handleConversation';

//assets
import avatar from '../assets/images/user.png';
import FundingPayment from './Funding/Payments';

//context
import { userState } from '../provider/UserContext';

//react router
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: '70px',
    width: '70px',
    margin: theme.spacing(3, 3, 1, 3),
    '&:hover': {
      cursor: 'pointer',
    },
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
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

const IndividualProject = ({ project }) => {
  const {
    title,
    subtitle,
    description,
    images,
    fundingGoal,
    investors,
    industry,
    location,
    owner,
    _id,
  } = project;
  const format = d3format(',');

  const classes = useStyles();
  const {
    state: { user },
  } = useContext(userState);

  const history = useHistory();
  const payload = {
    receiverId: owner._id,
  };

  const handleSendMessage = async () => {
    // create a new conversation or load the existing conversation
    const res = await createOrLoadConversation(user._id, owner, payload);
    if (res === true) {
      history.push({ pathname: `/messages`, state: { owner } });
    } else {
      console.log(res);
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const totalFunds = investors
    .map((a) => a.amountFunded)
    .reduce((acc, amountFunded) => acc + amountFunded, 0);

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
                  key={image}
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
              </Typography>
              <Typography variant="subtitle2" className={classes.numbers}>
                / {format(fundingGoal)}
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
              <Avatar
                alt="User"
                src={avatar}
                className={classes.avatar}
                onClick={() => history.push(`/users/${owner}`)}
              />
              <Typography
                element="h1"
                className={classes.userName}
                onClick={() => history.push(`/users/${owner}`)}
              >
                {owner.name}
              </Typography>
              <Typography
                element="h2"
                variant="subtitle1"
                className={classes.location}
              >
                {location}
              </Typography>
              <Box className={classes.buttons}>
                <Button
                  outlined
                  className={classes.button}
                  onClick={() => handleSendMessage()}
                >
                  Send Message
                </Button>
                <Button className={classes.button} onClick={handleClickOpen}>
                  Fund This Project
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <FundingPayment open={open} onClose={handleClose} id={_id} />
    </Container>
  );
};

export default IndividualProject;
