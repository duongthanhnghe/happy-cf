import { Router } from "express";
import {
  getAllPromotionGifts,
  getPromotionGiftById,
  createPromotionGift,
  updatePromotionGift,
  deletePromotionGift,
} from "../../../controllers/v1/admin/promotion-gift.controller";
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'

const router = Router();

router.get("/", authenticateAdmin, getAllPromotionGifts);
router.get("/:id", authenticateAdmin, getPromotionGiftById);
router.post("/", authenticateAdmin, createPromotionGift);
router.put("/:id", authenticateAdmin, updatePromotionGift);
router.delete("/:id", authenticateAdmin, deletePromotionGift);

export default router;
