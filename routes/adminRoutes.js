const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const UserController = require("../controllers/UserController");

router.post("/users", UserController.createUser);   
router.get("/users", UserController.getUsers);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);
module.exports = router;
