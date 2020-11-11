const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, '', (err, decodedToken) => {
      if (err) {
        // token expired
      } else {
        // user is authenticated
      }
    })
  } else {
    // no token, user is unauthenticated
  }
}

module.exports = requireAuth;
