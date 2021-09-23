const {
  fetchReviewById,
  changeReviewById,
  fetchAllReviews,
  fetchCommentsForReviewById,
} = require("../models/reviewModels");

exports.getReviews = async (req, res, next) => {
  try {
    const { sort_by, order, category } = req.query;

    const fetchedReviews = await fetchAllReviews(sort_by, order, category);

    res.status(200).send({ reviews: fetchedReviews });
  } catch (error) {
    next(error);
  }
};

exports.getReviewById = async (req, res, next) => {
  try {
    const review_id = req.params.review_id;

    const fetchedReview = await fetchReviewById(review_id);

    res.status(200).send({ review: fetchedReview });
  } catch (error) {
    next(error);
  }
};

exports.patchReviewById = async (req, res, next) => {
  try {
    const review_id = req.params.review_id;

    const incAmount = req.body.inc_votes;

    const patchedReview = await changeReviewById(incAmount, review_id);

    res.status(200).send({ updatedReview: patchedReview });
  } catch (error) {
    next(error);
  }
};

exports.getCommentsForReviewById = async (req, res, next) => {
  try {
    const review_id = req.params.review_id;

    const commentsForReview = await fetchCommentsForReviewById(review_id);

    res.status(200).send({ review_comments: commentsForReview });
  } catch (error) {
    next(error);
  }
};
