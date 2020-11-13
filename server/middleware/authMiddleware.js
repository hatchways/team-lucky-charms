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
    // no token, user is unauthenticated
  }
};

module.exports = requireAuth;
