const db = require("../connection");
const format = require("pg-format");
const {
  formatCategoryData,
  formatUserData,
  formatReviewData,
  formatCommentData,
} = require("../utils/data-manipulation");

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  // 1. create tables
  // 2. insert data

  //Drops Tables if they already exist
  return (
    db
      .query("DROP TABLE IF EXISTS comments")
      .then(() => {
        return db.query("DROP TABLE IF EXISTS reviews");
      })
      .then(() => {
        return db.query("DROP TABLE IF EXISTS users");
      })
      .then(() => {
        return db.query("DROP TABLE IF EXISTS categories");
      })

      //Creates New Tables and gives them collum names
      .then(() => {
        return db.query(`
    CREATE TABLE categories ( 
      slug VARCHAR (255) PRIMARY KEY NOT NULL,
      description TEXT NOT NULL);`);
      })
      .then(() => {
        return db.query(`
      CREATE TABLE users ( 
        username VARCHAR (255) PRIMARY KEY NOT NULL, 
        avatar_url TEXT NOT NULL, 
        name VARCHAR (255) NOT NULL);`);
      })

      .then(() => {
        return db.query(`
        CREATE TABLE reviews ( 
          review_id SERIAL PRIMARY KEY NOT NULL, 
          title VARCHAR (500) NOT NULL, 
          review_body TEXT NOT NULL, 
          designer VARCHAR (255) NOT NULL, 
          review_img_url VARCHAR (255) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
          votes INT DEFAULT 0 NOT NULL,

          category VARCHAR (255) NOT NULL,
          FOREIGN KEY (category) REFERENCES categories(slug),

          owner VARCHAR (255) NOT NULL,
          FOREIGN KEY (owner) REFERENCES users(username),

          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
          );`);
      })

      .then(() => {
        return db.query(`
          CREATE TABLE comments ( 
            comment_id SERIAL PRIMARY KEY NOT NULL, 
            author VARCHAR (255) NOT NULL,
            
            review_id INT NOT NULL,
            FOREIGN KEY (review_id) REFERENCES reviews (review_id),

            votes INT DEFAULT 0 NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
            body TEXT NOT NULL );`);
      })

      //Populate tables with data from db folders.
      .then(() => {
        const sql = format(
          `
      INSERT INTO categories 
      (slug, description)
      VALUES 
      %L
      RETURNING * 
      `,
          formatCategoryData(categoryData)
        );

        return db.query(sql);
      })

      .then(() => {
        const sql = format(
          `
  INSERT INTO users 
  (username, avatar_url, name)
  VALUES 
  %L
  RETURNING * 
  `,
          formatUserData(userData)
        );

        return db.query(sql);
      })

      .then(() => {
        const sql = format(
          `
  INSERT INTO reviews 
  (title, review_body, designer, review_img_url,
  votes, category, owner, created_at)
  VALUES 
  %L
  RETURNING *

  `,
          formatReviewData(reviewData)
        );

        return db.query(sql);
      })

      .then(() => {
        const sql = format(
          `
  INSERT INTO comments
  (author, review_id, votes, created_at, body)
  VALUES 
  %L
  RETURNING *
  `,
          formatCommentData(commentData)
        );
        return db.query(sql);
      })
  );
};

module.exports = seed;
