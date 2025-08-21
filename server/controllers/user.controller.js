import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { generateAccessToken } from "../utils/generate-token.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// Update User
export const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const id = req.params.id;
  if (userId.toString() !== id) {
    return res.status(403).json({
      success: false,
      message: "You can only update your own account!",
    });
  }

  const { name, email, password } = req.body;

  const updateData = {};

  if (name) updateData.name = name.trim();
  if (email) updateData.email = email.trim();

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const avatarLocalPath = req.file?.path;
  if (avatarLocalPath) {
    const avatar = await uploadToCloudinary(avatarLocalPath);
    updateData.avatar = {
      url: avatar.secure_url,
      public_id: avatar.public_id,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: updatedUser,
  });
});

// Delete User
export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const id = req.params.id;
  if (userId.toString() !== id) {
    return res.status(403).json({
      success: false,
      message: "You can only delete your own account!",
    });
  }

  const deleteUser = await User.findByIdAndDelete(id);

  if (!deleteUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
