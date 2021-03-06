const db = require("../db/connection.js");

exports.fetchAllReviews = async (sort_by, order, category) => {
  let SQLQuery = `SELECT * FROM reviews `;
  const validCollums = [
    "review_id",
    "title",
    "review_body",
    "designer",
    "review_img_url",
    "votes",
    "category",
    "owner",
    "created_at",
  ];

  const validCategories = [
    "strategy",
    "hidden-roles",
    "dexterity",
    "push-your-luck",
    "roll-and-write",
    "deck-building",
    "engine-building",
    "euro game",
    "dexterity",
    "social deduction",
  ];

  if (order !== undefined && order !== "ASC" && order !== "DESC") {
    return Promise.reject({
      status: 400,
      msg: `Cannot sort in that order`,
    });
  }

  if (category !== undefined) {
    if (!validCategories.includes(category)) {
      return Promise.reject({
        status: 404,
        msg: `Cannot filter by that category`,
      });
    } else {
      SQLQuery += `WHERE category = '${category}' `;
    }
  }

  if (sort_by !== undefined) {
    if (!validCollums.includes(sort_by)) {
      return Promise.reject({
        status: 400,
        msg: `Cannot sort by that collum`,
      });
    } else {
      SQLQuery += `ORDER BY ${sort_by}`;
    }
  }

  if (sort_by === undefined) {
    SQLQuery += `ORDER BY created_at`;
  }

  if (order !== undefined) {
    if (order === "ASC") {
      SQLQuery += ` ASC`;
    } else {
      SQLQuery += ` DESC`;
    }
  }

  if (order === undefined) {
    SQLQuery += ` DESC`;
  }

  SQLQuery += ";";
  const response = await db.query(SQLQuery);

  for (let i = 0; i < response.rows.length; i++) {
    const commentsWithReviewID = await db.query(
      `SELECT * FROM comments WHERE review_id = $1;`,
      [response.rows[i].review_id]
    );
    const numCommentsForReview = commentsWithReviewID.rows.length;
    response.rows[i].comment_count = numCommentsForReview;
  }
  return response.rows;
};

exports.fetchReviewById = async (review_id) => {
  const response = await db.query(
    `SELECT * FROM reviews WHERE review_id = $1;`,
    [review_id]
  );

  if (response.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No review with that ID currently`,
    });
  } else {
    const commentsWithReviewID = await db.query(
      `SELECT * FROM comments WHERE review_id = $1;`,
      [review_id]
    );

    const numCommentsForReview = commentsWithReviewID.rows.length;

    response.rows[0].comment_count = numCommentsForReview;

    return response.rows[0];
  }
};

exports.changeReviewById = async (incAmount, review_id) => {
  const response = await db.query(
    `UPDATE reviews
        SET votes = votes + $1
        WHERE review_id = $2
        RETURNING *;`,
    [incAmount, review_id]
  );

  if (response.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No review with that ID currently`,
    });
  } else {
    return response.rows[0];
  }
};

exports.fetchCommentsForReviewById = async (review_id) => {
  const checkID = await db.query(
    `SELECT * FROM reviews 
    WHERE review_id = $1;`,
    [review_id]
  );

  if (checkID.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No review with that ID currently`,
    });
  } else {
    const response = await db.query(
      `SELECT * FROM comments 
      WHERE review_id = $1;`,
      [review_id]
    );

    if (response.rows.length === 0) {
      return [];
    } else {
      return response.rows;
    }
  }
};
exports.addCommentForReviewById = async (review_id, author, body) => {
  const reviewExistsCheck = await db.query(
    "SELECT * FROM reviews WHERE review_id = $1;",
    [review_id]
  );
  const authorExistsCheck = await db.query(
    "SELECT * FROM users WHERE username = $1;",
    [author]
  );

  let commentComponentsPresent = false;

  if (author !== undefined && body !== undefined) {
    commentComponentsPresent = true;
  }

  if (commentComponentsPresent === false) {
    return Promise.reject({
      status: 400,
      msg: `Missing an essential element of comment`,
    });
  }

  if (
    reviewExistsCheck.rows.length === 0 ||
    authorExistsCheck.rows.length === 0
  ) {
    return Promise.reject({
      status: 404,
      msg: `Unable to locate Review or Username`,
    });
  } else {
    const response = await db.query(
      `INSERT INTO comments
        (author, review_id, votes, created_at, body)
        VALUES 
        ($1, $2, 0, CURRENT_TIMESTAMP ,$3)
        RETURNING *;`,
      [author, review_id, body]
    );

    return response.rows[0];
  }
};
