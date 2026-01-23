import { Router } from "express";
import {
  getAllPromotionGifts,
  getPromotionGiftById,
  createPromotionGift,
  updatePromotionGift,
  deletePromotionGift,
  toggleActive,
} from "../../../controllers/v1/admin/promotion-gift.controller";
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'
import { validate } from '../../../middlewares/validate/validate'
import { createPromotionGiftSchema, updatePromotionGiftSchema, promotionGiftIdParamSchema } from '../../../../shared/validate/schemas/promotion.schema'

const router = Router();

router.get("/", authenticateAdmin, getAllPromotionGifts);
router.get("/:id", authenticateAdmin, getPromotionGiftById);
router.post("/", authenticateAdmin, validate(createPromotionGiftSchema), createPromotionGift);
router.put("/:id", authenticateAdmin, validate(updatePromotionGiftSchema), updatePromotionGift);
router.delete("/:id", authenticateAdmin, validate(promotionGiftIdParamSchema, 'params'), deletePromotionGift);
router.patch('/toggleActive/:id', authenticateAdmin, validate(promotionGiftIdParamSchema, 'params'), toggleActive)

export default router;
