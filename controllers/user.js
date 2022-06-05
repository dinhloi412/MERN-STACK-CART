const { User } = require("../models/user");
const bcrypt = require("bcrypt");
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
    } catch (error) {}
  },
};
module.exports = userController;
