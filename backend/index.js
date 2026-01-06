const express = require("express");
require("./db/config");

const bcrypt = require("bcryptjs");

const User = require("./db/User");
const Product = require("./db/Product");

const Jwt = require("jsonwebtoken");
const jwtKey = "ecommerce";

const app = express();
app.use(express.json());

const { body, validationResult } = require("express-validator");

const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

const registrationValidation = [
  body("name").notEmpty().withMessage("Name is required").trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Email is invalid"),
  body("password")
    .notEmpty()
    .withMessage("Passwrord is required")
    .trim()
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),
];

const loginValidation = [
  body("email").notEmpty().withMessage("Email is required").trim(),
  body("password").notEmpty().withMessage("Passwrord is required").trim(),
];

app.post("/register", [registrationValidation], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    res.send({ user: result });
  } catch (e) {
    res.status(500).send({ error: "registration failed", detail: e.message });
  }
});

app.post("/login", loginValidation, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials: Email" });
  }

  if (!user.password.startsWith("$2b$")) {
    if (req.body.password === user.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
      await user.save();
    } else {
      return res.status(401).json({ error: "invalid credentials" });
    }
  } else {
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials: password" });
    }
  }

  user = user.toObject();
  delete user.password;
  Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      res.status(500).send({ error: "something wrong in security" });
    }
    res.send({ user: user, auth: token });
  });
});

app.post("/add-product", verifyToken, async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});
app.get("/profile", (req, res) => {});
app.get("/products", verifyToken, async (req, res) => {
  const products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "no products found" });
  }
});

app.delete("/product/:id", verifyToken, async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    res.send(result);
  } catch (err) {
    res
      .status(500)
      .send({ error: "something went wrong while deleating product" });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const result = await Product.findOne({ _id: req.params.id });
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "no record found " });
  }
});

app.put("/product/:id", verifyToken, async (req, res) => {
  const result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
});

app.get("/search/:key", async (req, res) => {
  const result = await Product.find({
    $or: [
      {
        name: { $regex: req.params.key, $options: "i" },
      },
      {
        company: { $regex: req.params.key, $options: "i" },
      },
      {
        category: { $regex: req.params.key, $options: "i" },
      },
      {
        price: { $regex: req.params.key, $options: "i" },
      },
    ],
  });
  res.send(result);
});

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).send({ result: "Authorization header missing" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(403).send({ result: "Token not formatted correctly" });
  }

  const token = parts[1];

  Jwt.verify(token, jwtKey, (err, decoded) => {
    if (err) {
      console.error("JWT Verification error:", err);
      return res.status(401).send("Please provide a valid token");
    }

    req.user = decoded;
    next();
  });
}

app.listen(5000);

//curl -X POST -H "Content-Type: application/json" -d '{"name":"testuser","email":"test@example.com","password":"testpassword"}' http://localhost:5000/api/register
//curl -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"testpassword"}' http://localhost:5000/login
//curl -X GET -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:5000/products

//prerequisite
//install node.js and npm. mongodb

//environment set up
//mkdir directoryForProject
//cd directoryForProject
//npm init -y
//npm install express bcryptjs jsonwebtoken mongoose cors
//optional npm install nodemon
