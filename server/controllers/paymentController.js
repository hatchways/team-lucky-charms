const Stripe = require('stripe');
const stripe = Stripe(process.env.SECRET_KEY);

module.exports.fundProject = async (req, res) => {
  try {
    const { amount } = req.body;
    //this method can be changed based on our needs in the future.
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'cad',
    });
    res.status(200).send(paymentIntent.client_secret);
    console.log(paymentIntent);
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};
