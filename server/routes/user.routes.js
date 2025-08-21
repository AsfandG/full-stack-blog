import express from "express";
import { deleteUser, updateUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.put("/:id", auth, upload.single("avatar"), updateUser);
router.delete("/:id", auth, deleteUser);

export default router;
