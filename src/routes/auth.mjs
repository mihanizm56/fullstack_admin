import express from "express";
import { saveUser, loginUser, tokenAuth } from "../controllers/auth/index.mjs";
import { cookieTokenAuth } from "../middlewares/auth/index.mjs";

const router = express.Router();

router.put("/", saveUser);
router.post("/", loginUser);
router.post("/token", cookieTokenAuth, tokenAuth);

export default router;
