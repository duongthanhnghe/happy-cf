import { Router } from "express";
import {
  getAllPromotionGiftUsage,
} from "../../../controllers/v1/admin/promotion-gift-usage.controller";
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'

const router = Router();

router.get("/", authenticateAdmin, getAllPromotionGiftUsage);

export default router;
