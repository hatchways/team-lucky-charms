import React from 'react';
import { Button as MuiButton, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  button: (props) => ({
    backgroundColor: props.outlined ? '#fff' : theme.palette.primary.main,
    border: props.outlined ? '1px solid #ddd' : 'null',
    color: props.outlined ? '#000' : '#fff',
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2),
    textTransform: 'uppercase',
    width: '175px',
  }),
}));

const Button = ({ children, onClick, ...otherProps }) => {
  const classes = useStyles({...otherProps});

  return <MuiButton onClick={onClick} className={classes.button}>{children}</MuiButton>;
};

export default Button;
