const User = require('../models/User');

async function getUser(req, res) {
  const user = await User.findById(req.params.userId).select('-password');

  if (!user) {
    return res.status(404);
  };
  res.status(200).send(user);
}

async function updateUser(req, res) {
  const id = req.params.userId;
  const update = { ...req.body };
  const user = await User.findByIdAndUpdate(id, update, { new: true });

  // TODO: remove 'password' prop from returned user

  if (!user) {
    return res.status(404);
  }
  res.status(200).send(user);
}

module.exports = { getUser, updateUser };
