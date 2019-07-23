import dotenv from "dotenv";
import { port, dbURL } from "./services/variables/index.mjs";
import "./services/db-listeners/index.mjs";
import createError from "http-errors";
import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import bodyParser from "body-parser";
import router from "./routes/root.mjs";
// import startChat from "./controllers/chat";
import http_server from "http";

/// prepare config for server
dotenv.config();
const app = express();
const server = http_server.createServer(app);

app.use(cors({ origin: "*" }));
app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(process.cwd(), "public")));

app.use("/", router);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
});

const startServer = (ownServer, ownPort) =>
  new Promise((resolve, reject) => {
    try {
      ownServer.listen(ownPort, () => {
        resolve(ownServer);
      });
    } catch (error) {
      reject(error);
    }
  });

// func to start the db connection
const startDB = () => {
  const options = {
    useNewUrlParser: true,
    useFindAndModify: false
  };

  mongoose.Promise = global.Promise;
  mongoose.connect(dbURL, options);
  mongoose.set("useCreateIndex", true);
  console.log("connected to mongo db");

  return mongoose.connection;
};

const startApp = serverPort => serverState => {
  startDB().once("open", () => {
    startServer(serverState, serverPort)
      .then(server => {
        console.log("app started on port", port);
        // startChat(server);
        // console.log("chat started on port", port);
      })
      .catch(error => console.log("error during server start", error));
  });
};

// if (require.main === module) {
startApp(port)(server);
// } else {
//   module.exports.startApp = startApp(port);
// }
