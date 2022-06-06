const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userController = {
  accessToken: (user) => {
    return jwt.sign(
      { id: user._id, admin: user.role },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "30s",
      }
    );
  },
  refreshToken: (user) => {
    return jwt.sign(
      { id: user._id, admin: user.role },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "356d",
      }
    );
  },
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
        const accessToken = userController.accessToken(user);
        const refreshToken = userController.refreshToken(user);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        user.token = refreshToken;
        await user.save();
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
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
      await User.findById(req.params.id);
      res.status(200).json("deleted ");
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json("you are not auth");
    }
    jwt.verify(refreshToken, process.env.JWT_REF_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      const newAccessToken = userController.accessToken(user);
      const newRefreshToken = userController.refreshToken(user);
      user.token = newRefreshToken;

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  },
  logOut: async (req, res) => {
    //Clear cookies when user logs out
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    res.clearCookie("refreshToken");
    res.status(200).json("Logged out successfully!");
  },
};
module.exports = userController;
