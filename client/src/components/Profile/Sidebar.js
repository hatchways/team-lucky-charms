import React, { useState } from 'react';
import { Avatar, Box, makeStyles, Typography } from '@material-ui/core';

// ASSETS
import avatar from '../../assets/images/user.png';
import linkedin from '../../assets/images/linkedin-icon.png';
import angellist from '../../assets/images/angellist-icon.png';

// COMPONENTS
import EditProfileModal from './EditProfileModal';
import Button from '../Button';
import TextBubble from '../TextBubble';

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: '100px',
    margin: theme.spacing(4, 0, 2, 0),
    width: '100px',
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

const Sidebar = ({ isOwnProfile, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const classes = useStyles();
  return (
    <>
      <EditProfileModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
      />
      <Box className={classes.sidebar}>
        <Box className={classes.userMeta}>
          <Avatar alt="User" src={avatar} className={classes.avatar} />
          <Typography element="h1" className={classes.userName}>
            {user.name}
          </Typography>
          <Typography
            element="h2"
            variant="subtitle1"
            className={classes.location}
          >
            {user.location}
          </Typography>
          {isOwnProfile ? (
            <Button margin outlined onClick={() => setIsModalOpen(true)}>
              Edit Profile
            </Button>
          ) : (
            <Button margin>Send Message</Button>
          )}
          <Typography
            element="p"
            variant="subtitle1"
            className={classes.description}
          >
            {user.aboutMe.length > 0 ? (
              user.aboutMe
            ) : (
              <span style={{ fontStyle: 'italic' }}>No info provided yet</span>
            )}
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
    </>
  );
};

export default Sidebar;
