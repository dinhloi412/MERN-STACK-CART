const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userController = {
  register: async (req, res) => {
    const salt = 10;
    const { name, email, password, lastname } = req.body;

    try {
      const user = await User.findOne({ email: req.body.email });
      const hashPassword = await bcrypt.hash(password, salt);
      if (!user) {
        const newUser = new User({
          name,
          email,
          password: hashPassword,
          lastname,
        });
        await newUser.save();
        return res.status(200).json({ msg: "register successfull" });
      }
      return res.status(500).json({ msg: "register fail" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        res.status(500).json("Incorrect username");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.status(500).json("Incorrect password");
      }
      if (user && validPassword) {
        const accessToken = jwt.sign(
          { id: user._id, admin: user.role },
          process.env.JWT_ACCESS_KEY,
          {
            expiresIn: "3000s",
          }
        );
        user.token = accessToken;
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others });
      }
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      res.status(500).json(user);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};
module.exports = userController;
