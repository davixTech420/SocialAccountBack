const express = require("express");
const router = express.Router();

const SocialAccountController = require("../controllers/SocialAccountController");


router.get("/",SocialAccountController.getSocialAccount);
router.post("/",SocialAccountController.createSocialAccount);
router.put("/:id",SocialAccountController.updateSocialAccount);
router.delete("/:id",SocialAccountController.deleteSocialAccount);


module.exports = router;


