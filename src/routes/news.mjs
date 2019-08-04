import express from "express";
import {
  getNews,
  newNews,
  updateNews,
  deleteNews
} from "../controllers/news/news.mjs";
import { cookieTokenAuth } from "../middlewares/auth/index.mjs";

const router = express.Router();

router.get("/", getNews);
router.post("/", cookieTokenAuth, newNews);
router.put("/:id", cookieTokenAuth, updateNews);
router.delete("/:id", cookieTokenAuth, deleteNews);

export default router;
