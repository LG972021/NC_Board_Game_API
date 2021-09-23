exports.getHelloMessage = (req, res) => {
  res.status(200).send({ message: "Hello there" });
};

exports.getNoPathMessage = (req, res) => {
  res.status(404).send({ message: "No Results for this Path" });
};
