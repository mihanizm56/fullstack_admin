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

// // authentification & login
// router.post("/api/saveNewUser", authCtrl.createUser);
// router.post("/api/login", authCtrl.loginUser);
// router.post("/api/authFromToken", cookieTokenAuth, authCtrl.tokenAuth);

// // users rest
// router.put("/api/updateUser/:id", cookieTokenAuth, usersCtrl.updateUser);
// router.delete("/api/deleteUser/:id", cookieTokenAuth, usersCtrl.deleteUser);
// router.get("/api/getUsers", usersCtrl.getAllUsers);
// router.put(
//   "/api/updateUserPermission/:id",
//   cookieTokenAuth,
//   usersCtrl.updateUserPermissions
// );

// // news rest
// router.get("/api/getNews", newsCtrl.getNews);
// router.post("/api/newNews", cookieTokenAuth, newsCtrl.newNews);
// router.put("/api/updateNews/:id", cookieTokenAuth, newsCtrl.updateNews);
// router.delete("/api/deleteNews/:id", cookieTokenAuth, newsCtrl.deleteNews);

// // files
// router.post("/api/saveUserImage/:id", upload.any(), filesCtrl.saveUserImage);

// router.get("*", sendSPA.get);

/////
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

const test = () => console.log("test");

// users rest
// router.get("/", getAllUsers);
// router.put("/:id", cookieTokenAuth, updateUser);
// router.delete("/:id", cookieTokenAuth, deleteUser);
// router.put("/:id/permission", cookieTokenAuth, updateUserPermissions);
// router.post("/:id/image", upload.any(), saveUserImage);

router.get("/", getAllUsers);
router.put("/:id", cookieTokenAuth, updateUser);
router.delete("/:id", cookieTokenAuth, deleteUser);
router.put("/:id/permission", test);
router.put("/:id/image", upload.any(), saveUserImage);

export default router;
