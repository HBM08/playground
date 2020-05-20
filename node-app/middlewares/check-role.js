
module.exports = (role) => {
  return function(req, res, next) {
    const assignedRole = req.userData["role"];
    if (assignedRole === role) {
      return next();
    } else {
      return res.status(401).send("Insufficient role");
    }
  };
}