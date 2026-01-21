import User from "../models/User.js";
import jwt from "jsonwebtoken";

/* =========================
   Helper: Generate JWT
========================= */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/* =========================
   REGISTER USER
   ========================= */
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user (new run defaults)
    const user = await User.create({
      username,
      email,
      password,
      coins: 1000,
      runPosition: { x: 0, y: 0 },
    });

    return res.status(201).json({
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
};

/* =========================
   LOGIN USER
   (RESET RUN EVERY LOGIN)
========================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔁 Reset run on every login
    // user.coins = 100;
    // user.runPosition = { x: 0, y: 0 };
    // await user.save();

    return res.json({
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

export const getMe = async (req, res) => {
  try {
    // 🔥 Fetch fresh user from DB
    const user = await User.findById(req.user.id).populate({
      path: "equippedItem",
      populate: { path: "item" },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      coins: user.coins,
      position: user.runPosition,
      lastDailyClaim: user.lastDailyClaim,
      equippedItem: user.equippedItem
        ? {
            name: user.equippedItem.item.name,
            icon: user.equippedItem.item.icon,
            effect: user.equippedItem.item.effect,
          }
        : null,
    });
  } catch (err) {
    console.error("GET ME ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};
