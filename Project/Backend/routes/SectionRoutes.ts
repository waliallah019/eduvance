import express from "express";
import { getSectionsByClassIds } from "../controllers/SectionController";

const router = express.Router();

router.post("/sections", getSectionsByClassIds);

module.exports = router;