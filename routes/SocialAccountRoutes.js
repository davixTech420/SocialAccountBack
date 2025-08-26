const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const SocialAccountController = require("../controllers/SocialAccountController");
const { uploadToYoutube } = require("../services/uploadYoutube");



router.get("/",SocialAccountController.getSocialAccount);
router.post("/",SocialAccountController.createSocialAccount);
router.put("/:id",SocialAccountController.updateSocialAccount);
router.delete("/:id",SocialAccountController.deleteSocialAccount);

// Configuración de almacenamiento local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/videos");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Endpoint para subir video
router.post("/upload-video", upload.single("video"), async (req, res) => {
  try {
    const videoPath = req.file.path;

    // Aquí puedes conectar con YouTube, Facebook, etc.
    // Ejemplo: llamar a la función uploadToYoutube(videoPath)
     const youtubeResponse = await uploadToYoutube(
      videoPath,
      "Título de prueba desde NodeJS",
      "Descripción de prueba para el video subido con la API de YouTube"
    );

    res.json({
      message: "Video subido exitosamente al servidor y a youtube",
      path: videoPath,
      yotube: youtubeResponse,

    });
  } catch (error) {
    res.status(500).json({ error: "Error al subir el video" });
  }
});


module.exports = router;


