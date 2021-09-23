const express = require("express");
const {
  getReviewById,
  patchReviewById,
  getReviews,
} = require("../controllers/reviewControllers");
const reviewRouter = express.Router();

reviewRouter.get("/", getReviews);
reviewRouter.get("/:review_id", getReviewById);
reviewRouter.patch("/:review_id", patchReviewById);

module.exports = reviewRouter;
