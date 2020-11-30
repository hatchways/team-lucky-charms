import React from 'react';
import { TextField } from '@material-ui/core';

const TextInput = ({ id, label, ...otherProps }) => {
  return (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id={id}
      label={label}
      {...otherProps}
    />
  );
};

export default TextInput;
