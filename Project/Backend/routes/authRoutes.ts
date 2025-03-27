import express from "express";
const AuthController = require("../controllers/AuthController");

const router = express.Router();

// router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

module.exports = router;
