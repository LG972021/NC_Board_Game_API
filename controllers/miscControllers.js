exports.getHelloMessage = (req, res) => {
  res.status(200).send({ message: "Hello there" });
};

exports.getNoPathMessage = (req, res) => {
  res.status(404).send({ message: "No Results for this Path" });
};

exports.getPathList = (req, res) => {
  res.status(200).send({
    Misc_Endpoints: ["/", "/hello"],
    Category_Endpoints: "/",
    Review_Endpoints: ["/", "/:review_id", "/:review_id/comments"],
  });
};
