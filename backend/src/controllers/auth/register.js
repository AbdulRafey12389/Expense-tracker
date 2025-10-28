// CUSTOM MODULES...
import User from "../../models/user.js";
import { generateToken } from "../../ultils/jwt.js";

const register = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create and save new user (hashing happens in schema)
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    return res.status(201).json({
      message: "User registered successfully. ",
      user: {
        id: user._id,
        fullName: user.fullName,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export default register;
