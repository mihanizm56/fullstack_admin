import express from "express";
import userRouter from "./users.mjs";
import authRouter from "./auth.mjs";
import newsRouter from "./news.mjs";
import sendSPA from "../controllers/app/app.mjs";

const router = express.Router();

// rest
router.use("/api/users", userRouter);
router.use("/api/auth", authRouter);
router.use("/api/news", newsRouter);

/// send spa
router.get("*", sendSPA.get);

export default router;
