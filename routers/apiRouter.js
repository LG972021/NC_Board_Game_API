const express = require("express");
const { getHelloMessage } = require("../controllers/miscControllers");
const apiRouter = express.Router();
const app = require("../app.js");
const { getCategories } = require("../controllers/categoryControllers");
const { categoryRouter, reviewRouter } = require("../routers/index.js");

apiRouter.get("/hello", getHelloMessage);

apiRouter.use("/categories", categoryRouter);
apiRouter.use("/reviews", reviewRouter);

module.exports = apiRouter;
