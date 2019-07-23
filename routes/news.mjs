import express from "express";
import {
  getNews,
  newNews,
  updateNews,
  deleteNews
} from "../controllers/news/index.mjs";
import { cookieTokenAuth } from "../middlewares/auth/index.mjs";

const router = express.Router();

// // news rest
// router.get("/api/getNews", newsCtrl.getNews);
// router.post("/api/newNews", cookieTokenAuth, newsCtrl.newNews);
// router.put("/api/updateNews/:id", cookieTokenAuth, newsCtrl.updateNews);
// router.delete("/api/deleteNews/:id", cookieTokenAuth, newsCtrl.deleteNews);

router.get("/", getNews);
router.post("/", cookieTokenAuth, newNews);
router.put("/:id", cookieTokenAuth, updateNews);
router.delete("/:id", cookieTokenAuth, deleteNews);

export default router;
