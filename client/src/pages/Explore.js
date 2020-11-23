import React from "react";
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';



const Explore = () => {
  return (
    <div>
      <h1>Explore</h1>
      <Button
        variant="outlined"
        color="primary"
        component={Link}
        to="/payments"
      >
        Fund This Project
      </Button>
    </div>
  );
};

export default Explore;
