import express from "express";
import {
  loginUser,
  logout,
  refreshToken,
  registerUser,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

export default router;
