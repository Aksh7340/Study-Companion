import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* =========================
   Register
========================= */

router.post("/register", async (req, res) => {

  try {

    const { name, email, password, educationLevel } = req.body;

    if (!name || !email || !password || !educationLevel) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      educationLevel
    });

    await user.save();

    res.json({
      message: "User registered successfully"
    });

  } catch (error) {

    console.error("Register error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

});


/* =========================
   Login
========================= */

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Incorrect password"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      userId: user._id
    });

  } catch (error) {

    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

});

export default router;