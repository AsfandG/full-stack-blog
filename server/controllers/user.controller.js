import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
} from "../utils/generate-token.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

import { sendEmail } from "../utils/send-email.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    return res
      .status(400)
      .json({ success: false, message: "User already exist!" });
  }

  let avatarData = null;
  const avatarLocalPath = req.file?.path;
  if (avatarLocalPath) {
    const avatar = await uploadToCloudinary(avatarLocalPath);
    avatarData = {
      url: avatar.secure_url,
      public_id: avatar.public_id,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { resetToken, hashedToken, expireTime } = generateResetToken(1440);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    ...(avatarData && { avatar: avatarData }),
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpire: expireTime,
  });

  await user.save();

  const verifyUrl = `${process.env.CLIENT}/auth/verify-email/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: "Verify your Email",
    text: `Please verify your email by clicking on the following link: ${verifyUrl}`,
  });

  res.status(200).json({
    success: true,
    message:
      "User registered successfully! Please check your email to verify your account",
  });
});

// Login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });
  }

  const refreshToken = generateRefreshToken(user._id, user.role);
  user.refreshToken = refreshToken;
  await user.save();

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  const accessToken = generateAccessToken(user._id, user.role);

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({ success: true, user: loggedInUser, accessToken, refreshToken });
});

// Logout
export const logout = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);

  res.status(200).json({ success: true, message: "User Logged Out!" });
});
