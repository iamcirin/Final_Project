const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // const token = authHeader.split(" ")[1];
    jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json("token is not valid");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not allowed");
  }
};

module.exports = verify;
