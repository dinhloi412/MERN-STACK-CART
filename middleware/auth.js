const jwt = require("jsonwebtoken");

const middleware = {
  verifyToken: (req, res, next) => {
    try {
      const authHeader = req.header("Authorization");
      const token = authHeader && authHeader.split(" ")[1];
      if (token) {
        jwt.verify(token, process.env.JWT_ACCESS_KEY);

        next();
      } else {
        return res.status(401).json("You're not authenticated");
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  verifyTokenAndUserAuthorization: (req, res) => {
    verifyToken(req, res, () => {
      if (req.user._id === req.params.id || req.user.role) {
        next();
      } else {
        res.status(403).json("You're not allowed to do that!");
      }
    });
  },
};
module.exports = middleware;
