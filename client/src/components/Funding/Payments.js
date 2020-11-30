import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import {
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { userState } from '../../provider/UserContext';

const useStyles = makeStyles((theme) => ({
  cardElementWrapper: {
    marginTop: 20,
    padding: '17px 14px',
    borderStyle: 'solid',
    borderColor: 'rgb(0,0,0,0.23)',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: -4,
    marginRight: -4,
    '&:hover': {
      borderColor: 'black',
      borderWidth: 1,
    },
  },
  divider: {
    height: '0.25em',
    width: '8vh',
    margin: '3em',
    backgroundColor: theme.appTheme.background,
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
  },
  grid: {
    marginRight: '-15px',
    marginLeft: '-15px',
    width: 'auto',
    marginTop: '20px',
  },
}));

export default function FundingPayment(props) {
  const [isProcessing, setProcessingTo] = useState(false);
  const [checkoutError, setCheckoutError] = useState();
  const [price, setPrice] = useState();
  const [name, setName] = useState('');
  const classes = useStyles();
  const history = useHistory();
  const stripe = useStripe();
  const elements = useElements();
  const {
    state: { user },
  } = useContext(userState);

  const handleCardDetailsChange = (e) => {
    e.error ? setCheckoutError(e.error.message) : setCheckoutError();
  };
  const onSuccessfulCheckout = () => {
    history.push('/explore');
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const billingDetails = {
      name: name,
      email: 'test@now.com',
    };
    setProcessingTo(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const { data: clientSecret } = await axios.post('/fundproject', {
        amount: price * 100, // price is sent in cents to the strip server, we multiply here by 100 to make it dollars
        projectId: props.id,
        userId: user._id,
      });
      console.log(clientSecret);

      const paymentMethodReq = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      });

      if (paymentMethodReq.error) {
        setCheckoutError(paymentMethodReq.error.message);
        setProcessingTo(false);
        return;
      }

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodReq.paymentMethod.id,
      });

      if (error) {
        setCheckoutError(error.message);
        setProcessingTo(false);
        return;
      }
      onSuccessfulCheckout();
    } catch (err) {
      setCheckoutError(err.message);
      setProcessingTo(false);
    }
  };
  const iframeStyles = {
    base: {
      fontSize: '13px',
      iconColor: '#fff',
      '::placeholder': {
        color: 'light-dark',
      },
    },
    invalid: {
      iconColor: '#FF0000',
      color: '#FF0000',
    },
    complete: {
      iconColor: '#cbf4c9',
    },
  };

  const cardElementOpts = {
    iconStyle: 'solid',
    style: iframeStyles,
    hidePostalCode: true,
  };

  return (
    <Dialog
      open={props.open}
      aria-labelledby="form-dialog-title"
      onClose={props.onClose}
      maxWidth="sm"
    >
      <form onSubmit={handleFormSubmit}>
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Add Funds
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1} alignItems="flex-end">
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="name"
              label="Name"
              value={name}
              fullWidth
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="funds"
              label="Enter amount"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Grid>
          <Grid>
            <CardElement
              options={cardElementOpts}
              onChange={handleCardDetailsChange}
              className={classes.cardElementWrapper}
            />
          </Grid>
          {checkoutError && <Typography>{checkoutError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Grid container spacing={1} justify="center">
            <Grid item>
              <Button
                color="primary"
                type="submit"
                variant="contained"
                disabled={isProcessing || !stripe}
                style={{ marginTop: 20 }}
              >
                {isProcessing
                  ? 'Processing...'
                  : 'Add Funds' }
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </form>
    </Dialog>
  );
}
