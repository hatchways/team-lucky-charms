import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import {
  Container,
  CssBaseline,
  Grid,
  Typography,
  Divider,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  cardElementWrapper: {
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    width: 475,
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

export default function FundingPayment() {
  const [isProcessing, setProcessingTo] = useState(false);
  const [checkoutError, setCheckoutError] = useState();
  const [price, setPrice] = useState();
  const [name, setName] = useState('');
  const classes = useStyles();
  const history = useHistory();
  const stripe = useStripe();
  const elements = useElements();

  const handleCardDetailsChange = (e) => {
    e.error ? setCheckoutError(e.error.message) : setCheckoutError();
  };
  const onSuccessfulCheckout = () => {
    alert('Success');
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
        amount: price * 100,
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
    }
  };
  const iframeStyles = {
    base: {
      fontSize: '16px',
      iconColor: '#fff',
      '::placeholder': {
        color: '#69E781',
      },
      '&.StripeElement--empty': {
        width: '100%',
        padding: '15px',
      },
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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div>
          <form
            style={{ width: '100%', paddingTop: 20 }}
            onSubmit={handleFormSubmit}
          >
            <Typography component="h1" variant="h3">
              Add Funds
            </Typography>
            <Divider className={classes.divider} />
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
              />
            </Grid>
            {checkoutError && <Typography>{checkoutError}</Typography>}
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
                    : `Add Fund ${price ? price : ''}`}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </Container>
  );
}
