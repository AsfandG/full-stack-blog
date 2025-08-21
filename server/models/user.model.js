import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    avatar: {
      url: String,
      public_id: String,
    },
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema);
export default user;
