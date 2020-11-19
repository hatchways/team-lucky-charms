import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  bubble: (props) => ({
    backgroundColor: props.outlined ? '#fff' : theme.palette.primary.main,
    borderRadius: '100px',
    border: props.outlined ? '1px solid #ddd' : 'null',
    color: props.outlined ? '#000' : '#fff',
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '600',
    padding: theme.spacing(1, 2),
    textTransform: 'uppercase',
    margin: theme.spacing(0, 0.5),
  }),
}));

const TextBubble = ({ children, ...otherProps }) => {
  const classes = useStyles({ ...otherProps });
  return <div className={classes.bubble}>{children}</div>;
};

export default TextBubble;
