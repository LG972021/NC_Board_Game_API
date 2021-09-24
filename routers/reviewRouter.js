const express = require("express");
const {
  getReviewById,
  patchReviewById,
  getReviews,
  getCommentsForReviewById,
  postCommentForReviewById,
} = require("../controllers/reviewControllers");
const reviewRouter = express.Router();

reviewRouter.get("/", getReviews);
reviewRouter.get("/:review_id", getReviewById);
reviewRouter.get("/:review_id/comments", getCommentsForReviewById);

reviewRouter.patch("/:review_id", patchReviewById);

reviewRouter.post("/:review_id/comments", postCommentForReviewById);

module.exports = reviewRouter;
