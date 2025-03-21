import express from "express";
import { getSectionsByClassIds } from "../Controllers/SectionController";

const router = express.Router();

router.post("/sections", getSectionsByClassIds);

export default router;