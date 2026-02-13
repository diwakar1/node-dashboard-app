/**
 * verifyToken.js
 * Express middleware to authenticate requests using JWT tokens.
 * Protects routes by verifying the Authorization header and decoding the token.
 */
import jwt from 'jsonwebtoken';

export default function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).send({ result: "Authorization header missing" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(403).send({ result: "Token not formatted correctly" });
  }

  const token = parts[1];

  // Access JWT_SECRET directly from process.env to ensure it's loaded
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Please provide a valid token");
    }
    req.user = decoded;
    next();
  });
}
