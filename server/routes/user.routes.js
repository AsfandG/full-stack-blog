import express from "express";
import {
  deleteUser,
  getUser,
  getUsersList,
  updateUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { admin, auth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getUsersList);
router.get("/:id", getUser);
router.put("/:id", auth, upload.single("avatar"), updateUser);
router.delete("/:id", auth, admin, deleteUser);

export default router;
