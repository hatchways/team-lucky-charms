import React from 'react';
import { Button as MuiButton, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  button: (props) => ({
    backgroundColor: props.outlined ? '#fff' : theme.palette.primary.main,
    border: props.outlined ? '1px solid #ddd' : 'null',
    color: props.outlined ? '#000' : '#fff',
    margin: props.margin ? theme.spacing(2, 0) : 0,
    padding: theme.spacing(2),
    textTransform: 'uppercase',
    width: '175px',
    textAlign: props.align ? props.align : '',
  }),
}));

const Button = ({ children, onClick, className, ...otherProps }) => {
  const classes = useStyles({ ...otherProps });

  return (
    <MuiButton onClick={onClick} className={clsx(classes.button, className)}>
      {children}
    </MuiButton>
  );
};

export default Button;
