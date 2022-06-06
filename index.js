const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnect");

const userRoute = require("./routes/user");

const app = express();

dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
dbConnect();
const PORT = process.env.PORT || 5000;
app.use("/v1", userRoute);
app.use("/", (req, res) => {
  res.render("hello world");
});
app.listen(PORT, () => console.log(`server running at ${PORT}`));
