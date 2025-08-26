const express = require("express");
const app = express();
const sequelize = require("./config/db");
const port = 3000;
const SocialAccountRoutes = require("./routes/SocialAccountRoutes");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

app.use(express.json());
app.use("/socialAccounts", SocialAccountRoutes);
app.use("/", authRoutes);

sequelize
  .sync({ force: false, alter: false })
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
