const express = require("express");
const categoryRouter = express.Router();
const app = require("../app.js");
const { getCategories } = require("../controllers/categoryControllers.js");

categoryRouter.get("/", getCategories);

module.exports = categoryRouter;
