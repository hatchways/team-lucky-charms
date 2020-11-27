const Stripe = require('stripe');
const stripe = Stripe(process.env.SECRET_KEY);
const User = require('../models/User');
const Project = require('../models/projects');


module.exports.fundProject = async (req, res) => {
  try {
    const { amount, projectId, userId } = req.body;
    //this method can be changed based on our needs in the future.
    console.log(projectId, userId);
    const paymentIntent = await stripe.paymentIntents.create({
      amount, 
      currency: 'cad',
    });
    res.status(200).send(paymentIntent.client_secret);

    const insertInUser = { projectId: projectId, amountFunded: amount };
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { invested_in: insertInUser } },
    );
    console.log(user);

    const insertInProject = { investorId: userId, amountFunded: amount };
    const project = await Project.findOneAndUpdate(
      { _id: projectId },
      { $push: { investors: insertInProject } },
    );
    console.log(project);
    
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};
