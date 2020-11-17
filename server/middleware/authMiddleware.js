const jwt = require("jsonwebtoken");
const { TOKEN_SECRET_KEY } = require("../config");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, TOKEN_SECRET_KEY, (err, userToken) => {
      if (err) {
        // token expired
      } else {
        // user is authenticated
        req.id = userToken.id; // get current user id
        next();
      }
    });
  } else {
    return res.status(400).json({ errors: 'User not found' });
  }
};

module.exports = requireAuth;
