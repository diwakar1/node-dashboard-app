/**
 * verifyToken.js
 * Express middleware to authenticate requests using JWT tokens.
 * Protects routes by verifying the Authorization header and decoding the token.
 */
const jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_SECRET;

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).send({ result: "Authorization header missing" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(403).send({ result: "Token not formatted correctly" });
  }

  const token = parts[1];

  jwt.verify(token, jwtKey, (err, decoded) => {
    if (err) {
      return res.status(401).send("Please provide a valid token");
    }
    req.user = decoded;
    next();
  });
}
