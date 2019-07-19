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
import express from('express');
// import userRouter from "./users.mjs";
// import newsRouter from "./news.mjs";
// import filesRouter from "./files.mjs";

const test = () => console.log('test')

// router.use("/api/users", userRouter);
// router.use("/api/news", newsRouter);
// router.use("/api/files", filesRouter);
router.use("/api/users", test);
router.use("/api/news", test);
router.use("/api/files", test);

/// send spa
router.get("*", sendSPA.get);
////

module.exports = router;
