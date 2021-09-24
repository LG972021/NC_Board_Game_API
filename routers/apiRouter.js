const express = require("express");
const {
  getHelloMessage,
  getPathList,
} = require("../controllers/miscControllers");
const apiRouter = express.Router();
const app = require("../app.js");
const { getCategories } = require("../controllers/categoryControllers");
const { categoryRouter, reviewRouter } = require("../routers/index.js");

apiRouter.get("/hello", getHelloMessage);

apiRouter.use("/categories", categoryRouter);
apiRouter.use("/reviews", reviewRouter);
apiRouter.get("/", getPathList);

module.exports = apiRouter;
