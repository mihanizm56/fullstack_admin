// const express = require("express");
// const bodyParser = require("body-parser");
// const multer = require("multer");
// const sendSPA = require("../controllers/app");
// const authCtrl = require("../controllers/auth");
// const usersCtrl = require("../controllers/users");
// const newsCtrl = require("../controllers/news");
// const filesCtrl = require("../controllers/files");
// const { cookieTokenAuth } = require("../middlewares/auth");
// const upload = multer({ dest: "public/upload" });
// const router = express.Router();

import express from "express";
import { saveUser, loginUser, tokenAuth } from "../controllers/auth/index.mjs";
import { cookieTokenAuth } from "../middlewares/auth/index.mjs";
const router = express.Router();

router.put("/", saveUser);
router.post("/", loginUser);
router.post("/token", cookieTokenAuth, tokenAuth);

export default router;
