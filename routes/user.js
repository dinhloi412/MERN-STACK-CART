const express = require("express");
const middleware = require("../middleware/auth");
const router = express.Router();
const userController = require("../controllers/user");
router.get("/users", middleware.verifyToken, userController.getAllUsers);
router.post("/register", userController.register);
router.post("/login", userController.login);
module.exports = router;
