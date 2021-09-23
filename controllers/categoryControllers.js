const { fetchCategories } = require("../models/categoryModels.js");

exports.getCategories = async (req, res) => {
  const fetchedCategories = await fetchCategories();
  res.status(200).send({ categories: fetchedCategories });
};
