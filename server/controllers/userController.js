const User = require('../models/User');

async function getUser(req, res) {
  const user = await User.findById(req.params.userId).select('-password');

  if (!user) {
    return res.status(404);
  }
  res.status(200).send(user);
}

async function updateUser(req, res) {
  const id = req.params.userId;
  const authId = req.id;

  // authenticated user must be the same as the user being updated
  if (id !== authId) {
    return res.status(403);
  }

  const update = { ...req.body };
  const user = await User.findByIdAndUpdate(id, update, {
    new: true,
    useFindAndModify: false,
  });

  if (!user) {
    return res.status(404);
  }
  user.password = null;
  res.status(200).send(user);
}

module.exports = { getUser, updateUser };
