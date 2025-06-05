const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const User = require("./models/User"); // ✅ Correct import
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ✅ Use correct variable name
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Signup route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).send("Data successfully saved");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).send("Invalid credentials");
    }
    res.send("Login successful");
  } catch (err) {
    res.status(500).send("Error logging in");
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
