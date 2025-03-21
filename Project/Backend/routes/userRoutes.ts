import express from "express";
const { getUser, resetPassword } = require("../controllers/userController");

const router = express.Router();

router.post("/get", getUser);
router.post("/reset-password", resetPassword);

module.exports = router;
