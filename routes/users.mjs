import express from "express";
import multer from "multer";
import {
  updateUser,
  deleteUser,
  getAllUsers,
  updateUserPermissions,
  saveUserImage
} from "../controllers/users/index.mjs";
import { cookieTokenAuth } from "../middlewares/auth/index.mjs";

const router = express.Router();
const upload = multer({ dest: "public/upload" });

router.get("/", getAllUsers);
router.put("/:id", cookieTokenAuth, updateUser);
router.delete("/:id", cookieTokenAuth, deleteUser);
router.put("/:id/permission", cookieTokenAuth, updateUserPermissions);
router.put("/:id/image", upload.any(), saveUserImage);

export default router;
