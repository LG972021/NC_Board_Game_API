const express = require("express");
const { getNoPathMessage } = require("./controllers/miscControllers");
const { handleCustomErrors, handleServerErrors } = require("./errors");
const apiRouter = require("./routers/apiRouter");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handleServerErrors);

app.all("*", getNoPathMessage);

module.exports = app;
