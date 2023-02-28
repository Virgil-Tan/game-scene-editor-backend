const jwt = require("jsonwebtoken");

const withUser = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    try {
      const user = jwt.verify(bearerToken, process.env.JWT_SECRET);
      req.user = user;
    } catch (err) {
      return next();
    }
    return next();
  } else {
    return next();
  }
}

const verifyUser = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    try {
      const user = jwt.verify(bearerToken, process.env.JWT_SECRET);
      req.user = user;
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  } else {
    // Forbidden
    return res.status(403).send("A token is required for authentication");
  }
}

module.exports = { verifyUser, withUser }