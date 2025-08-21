import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "./middlewares/auth.js";
import errorHandler from "./middlewares/error-handler.js";
import cookieParser from "cookie-parser";

dotenv.config();

connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", auth, (req, res) => {
  res.send({ message: "Hello from Node.js + Express + MongoDB 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(errorHandler);
