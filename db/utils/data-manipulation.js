// extract any functions you are using to manipulate your data, into this file

exports.formatCategoryData = (categoryData) => {
  const formattedCategoryArr = categoryData.map((category) => {
    const categoryArr = [category.slug, category.description];
    return categoryArr;
  });
  return formattedCategoryArr;
};

exports.formatUserData = (userData) => {
  const formattedUserArr = userData.map((user) => {
    const userArr = [user.username, user.avatar_url, user.name];
    return userArr;
  });
  return formattedUserArr;
};

exports.formatReviewData = (reviewData) => {
  const formattedReviewArr = reviewData.map((review) => {
    const reviewArr = [
      review.title,
      review.review_body,
      review.designer,
      review.review_img_url,
      review.votes,
      review.category,
      review.owner,
      review.created_at,
    ];
    return reviewArr;
  });
  return formattedReviewArr;
};

exports.formatCommentData = (commentData) => {
  const formattedCommentArr = commentData.map((comment) => {
    const commentArr = [
      comment.author,
      comment.review_id,
      comment.votes,
      comment.created_at,
      comment.body,
    ];
    return commentArr;
  });
  return formattedCommentArr;
};
