const jwt = require("jsonwebtoken");
const { TOKEN_SECRET_KEY } = require("../config");

const requireAuth = (req, res, next) => {
  console.log("middleware");
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, TOKEN_SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log("Token expired");
        // token expired
      } else {
        // user is authenticated
        console.debug("Token exists", decodedToken);
        req.id = decodedToken.id; // get current user id
        next();
      }
    });
  } else {
    // no token, user is unauthenticated
  }
};

module.exports = requireAuth;
