const User = require('../models/User');

async function getUser(req, res) {
  const user = await User.findById(req.params.userId).select('-password');

  if (!user) {
    return res.status(404);
  };
  res.status(200).send(user);
}

module.exports = { getUser };
