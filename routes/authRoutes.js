const express = require("express");
const { google } = require("googleapis");
const router = express.Router();
const SocialAccount = require("../models/SocialAccount");

// Función para crear el cliente OAuth2 con datos de la BD
const getOAuth2Client = async () => {
  try {
    // Buscar credenciales en tu colección SocialAccount
    const account = await SocialAccount.findOne({ platform: "youtube" });

    if (!account) {
      throw new Error("❌ No se encontró la cuenta de YouTube en la BD");
    }

    if (!account.clientId || !account.clientSecret) {
      throw new Error("❌ Credenciales incompletas en la BD");
    }

    const CLIENT_ID = account.clientId;
    const CLIENT_SECRET = account.clientSecret;
    const REDIRECT_URI = "http://localhost:3000/oauth2callback";

    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );

    return oauth2Client;
  } catch (error) {
    console.error("Error creando OAuth2Client:", error);
    throw error;
  }
};

// 1️⃣ Ruta para redirigir al login de Google
router.get("/auth", async (req, res) => {
  try {
    const oauth2Client = await getOAuth2Client();

    const scopes = [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube",
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent", // importante para que devuelva refresh_token
      scope: scopes,
    });

    console.log("🔗 Redirigiendo a:", url);
    res.redirect(url);
  } catch (error) {
    console.error("❌ Error en /auth:", error);
    res.status(500).json({
      error: error.message,
      details: "Verifica que las credenciales estén en la base de datos",
    });
  }
});

// 2️⃣ Ruta callback para capturar el código y convertirlo en tokens
router.get("/oauth2callback", async (req, res) => {
  try {
    const { code, error: authError } = req.query;

    if (authError) {
      throw new Error(`Error de autenticación: ${authError}`);
    }

    if (!code) {
      throw new Error("No se recibió código de autorización");
    }

    console.log("📝 Código recibido:", code);

    const oauth2Client = await getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    console.log("✅ Tokens obtenidos:", {
      access_token: tokens.access_token ? "✅ Presente" : "❌ Faltante",
      refresh_token: tokens.refresh_token ? "✅ Presente" : "❌ Faltante",
      expiry_date: tokens.expiry_date
        ? new Date(tokens.expiry_date)
        : "No definido",
    });

    // Guardar tokens en la base de datos
   let account = await SocialAccount.findOne({ platform: "youtube" });

if (!account) {
  account = new SocialAccount({
    platform: "youtube",
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: tokens.expiry_date,
  });
} else {
  account.accessToken = tokens.access_token;
  account.refreshToken = tokens.refresh_token;
  account.expiresAt = tokens.expiry_date;
}

await account.save();

    console.log("💾 Tokens guardados en la base de datos");

    // Redirigir a una página de éxito o mostrar los tokens
    res.send(`
      <html>
        <body>
          <h1>✅ Autenticación exitosa</h1>
          <p>Tokens guardados correctamente en la base de datos</p>
          <p>Puedes cerrar esta ventana</p>
          <script>
            setTimeout(() => window.close(), 3000);
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("❌ Error en /oauth2callback:", error);
    res.status(500).send(`
      <html>
        <body>
          <h1>❌ Error en autenticación</h1>
          <p>${error.message}</p>
          <a href="/auth">Intentar nuevamente</a>
        </body>
      </html>
    `);
  }
});

// 3️⃣ Ruta para verificar el estado de la autenticación
router.get("/auth/status", async (req, res) => {
  try {
    const account = await SocialAccount.findOne({ platform: "youtube" });

    if (!account) {
      return res.json({
        authenticated: false,
        message: "No hay cuenta de YouTube configurada",
      });
    }

    const isAuthenticated = !!(account.accessToken && account.refreshToken);

    res.json({
      authenticated: isAuthenticated,
      hasAccessToken: !!account.accessToken,
      hasRefreshToken: !!account.refreshToken,
      clientIdConfigured: !!account.clientId,
      clientSecretConfigured: !!account.clientSecret,
      account: {
        platform: account.platform,
        clientId: account.clientId ? "✅ Configurado" : "❌ Faltante",
        clientSecret: account.clientSecret ? "✅ Configurado" : "❌ Faltante",
        accessToken: account.accessToken ? "✅ Presente" : "❌ Faltante",
        refreshToken: account.refreshToken ? "✅ Presente" : "❌ Faltante",
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4️⃣ Ruta para probar la subida de videos (opcional)
router.get("/test-auth", async (req, res) => {
  try {
    const oauth2Client = await getOAuth2Client();

    // Verificar si tenemos tokens guardados
    const account = await SocialAccount.findOne({ platform: "youtube" });
    if (account && account.accessToken) {
      oauth2Client.setCredentials({
        access_token: account.accessToken,
        refresh_token: account.refreshToken,
      });
    }

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    // Hacer una prueba simple de la API
    const response = await youtube.channels.list({
      part: "snippet",
      mine: true,
    });

    res.json({
      success: true,
      channel: response.data.items[0].snippet.title,
      message: "Conexión con YouTube API exitosa",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error conectando con YouTube API. Verifica la autenticación.",
    });
  }
});

module.exports = router;
