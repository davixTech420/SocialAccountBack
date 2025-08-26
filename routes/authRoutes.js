const express = require("express");
const { google } = require("googleapis");
const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  "m", // client_id
  "G", // client_secret
  "http://localhost:3000/oauth2callback" // redirect_uri
);

// 1️⃣ Ruta para redirigir al login de Google
router.get("/auth", (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/youtube.upload"];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // importante para que devuelva refresh_token
    scope: scopes,
  });
  res.redirect(url);
});

// 2️⃣ Ruta callback para capturar el código y convertirlo en tokens
router.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  console.log("TOKENS:", tokens);
  res.json(tokens); // Aquí te devuelve access_token y refresh_token
});

module.exports = router;
