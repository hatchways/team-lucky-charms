const Stripe = require('stripe');
const stripe = Stripe(process.env.SECRET_KEY);
const User = require('../models/User');
const Project = require('../models/projects');
const Notification = require('../models/Notification');
const { emitNewNotification } = require('../socketio-server');

module.exports.fundProject = async (req, res) => {
  try {
    const { amount, projectId, userId } = req.body;
    //this method can be changed based on our needs in the future.
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'cad',
    });
    res.status(200).send(paymentIntent.client_secret);

    const insertInUser = { projectId: projectId, amountFunded: amount };
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { invested_in: insertInUser } },
    );

    const insertInProject = { investorId: userId, amountFunded: amount };
    const investedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      { $push: { investors: insertInProject } },
      { new: true },
    );
    const projectOwner = investedProject.owner;
    await Notification.create({
      read: false,
      recipient: projectOwner,
      sender: userId,
      type: 'funding',
    });
    emitNewNotification(investedProject.owner);
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};
