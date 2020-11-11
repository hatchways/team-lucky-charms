const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const maxAge = 6480; // one week in seconds
const createToken = (id) => {
  return jwt.sign({ id }, 'we need to create a better secret key', { expiresIn: maxAge })
}

module.exports.registerPost = (req, res) => {
  const { email, name, password, password2 } = req.body;

  const { errors, isValid } = validateRegisterInput({ email, name, password, password2 });

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  // check if email already in use
  User.findOne({ email }).then(async (user) => {
    if (user) {
      return res.status(400).json({ errors: { email: 'Email already exists' }})
    }
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({ email, name, password: hashedPassword });
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      return res.status(201).json({ user, token });
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  })
}

module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  const { errors, isValid } = validateLoginInput({ email, password });

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  const user = await User.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      return res.status(201).json({ user, token });
    }
    return res.status(400).json({ errors: { password: 'Password incorrect' }})
  }
  return res.status(400).json({ errors: { email: 'Email not found' }})
}