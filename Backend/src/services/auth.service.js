const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * REGISTER USER
 */
const registerUser = async (body) => {
  const { name, email, password, walletAddress, dateOfBirth } = body;

  if (!walletAddress)
    throw new Error("Wallet address is required");

  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    walletAddress,
    dateOfBirth
  });

  return user;
};

/**
 * LOGIN USER
 */
const loginUser = async (body) => {
  const { email, password } = body;

  const user = await User.findOne({ email });
  if (!user)
    throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user
  };
};

module.exports = {
  registerUser,
  loginUser
};
