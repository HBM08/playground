const healtCheck = async (req, res, next) => {
  res.json("Node application is up");
};

module.exports = healtCheck;