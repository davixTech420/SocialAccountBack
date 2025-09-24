const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const SocialAccountRoutes = require("./routes/SocialAccountRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const UserController = require("./controllers/UserController");
const User = require("./models/User");
const { auth } = require("googleapis/build/src/apis/abusiveexperiencereport");
const app = express();
const port = 3000;

require("dotenv").config();

app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite solicitudes sin origen (como apps móviles, Postman)
      if (!origin) return callback(null, true);

      // Lista de orígenes permitidos
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:8081",
        "exp://127.0.0.1:8081",
        "exp://192.168.0.115",
      ];

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Origen no permitido por CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400, // 24 horas
  })
);

app.post("/login", UserController.login);
app.use("/socialAccounts", authMiddleware, SocialAccountRoutes);
app.use("/admin", authMiddleware, adminRoutes);
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
