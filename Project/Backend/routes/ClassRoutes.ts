import express from "express";
import { addClass, getClasses, deleteClass, updateClass } from "../controllers/ClassController";

const router = express.Router();

router.post("/add", addClass);
router.get("/", getClasses);
router.delete("/:id", deleteClass);
router.put("/:id", updateClass);

module.exports = router;