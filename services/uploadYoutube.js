const fs = require("fs");
const { google } = require("googleapis");

const CLIENT_ID = "7";
const CLIENT_SECRET = "";
const REDIRECT_URI = "http://localhost:3000/oauth2callback"; // debe ser igual al que usaste
const REFRESH_TOKEN = ""; // el que obtuviste

// Configurar OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});

/**
 * Subir video a YouTube
 * @param {string} videoPath - Ruta al archivo de video en tu servidor
 * @param {string} title - Título del video
 * @param {string} description - Descripción del video
 */
async function uploadToYoutube(videoPath, title, description) {
  try {
    const res = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: title,
          description: description,
          tags: ["nodejs", "api", "upload"],
          categoryId: "22", // categoría: 22 = People & Blogs
        },
        status: {
          privacyStatus: "private", // "public" | "private" | "unlisted"
        },
      },
      media: {
        body: fs.createReadStream(videoPath),
      },
    });

    console.log("✅ Video subido con éxito:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error subiendo el video a YouTube:", err);
    throw err;
  }
}

module.exports = { uploadToYoutube };
