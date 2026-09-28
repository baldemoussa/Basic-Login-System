require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/user-model");

//BEGIN database access management
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.once("open", () => {
  console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
});
mongoose.connection.on("error", (error) => {
  console.log("MongoDB connection error: ", error);
});

mongoose.connection.once("close", () => {
  console.log("Connection to MongoDB has closed.");
});
//END database access management

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function toPublicUser(user) {
  const userData = user.toObject();
  delete userData.password;
  return userData;
}

router.post("/api/users/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ message: "This user already exists." });
    }

    const newUser = await User.create({ username, email, password });
    res.status(201).json(toPublicUser(newUser));
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

router.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password." });
    }

    const correctPw = await user.isCorrectPassword(password);
    if (!correctPw) {
      return res.status(400).json({ message: "Incorrect email or password." });
    }

    const payload = { _id: user._id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, user: toPublicUser(user) });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is listening on: http://localhost:${PORT}`);
});
