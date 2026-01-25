import { Router } from "express";
import {
  getAvailablePromotionGifts
} from "../../controllers/v1/promotion-gift.controller";

const router = Router();

router.post("/", getAvailablePromotionGifts);

export default router;
