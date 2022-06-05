const mongoose = require("mongoose");
const conn = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URL)
      .then(() => console.log("success"))
      .catch((err) => console.log(err));
  } catch (error) {}
};
module.exports = conn;
