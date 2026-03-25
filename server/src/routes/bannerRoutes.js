import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

import { getActiveBanners, createBanner } from "../controllers/bannerControllers.js";

const router = express.Router();


router.get("/", getActiveBanners);

router.post("/", authMiddleware, adminMiddleware, createBanner);

export default router;
