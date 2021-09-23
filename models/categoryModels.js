const db = require("../db/connection.js");

exports.fetchCategories = async () => {
  const response = await db.query(`SELECT * FROM categories`);
  return response.rows;
};
