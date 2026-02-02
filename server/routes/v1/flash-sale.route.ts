import { Router } from "express";
import {
  getTopPriorityFlashSaleRandom,
  getFlashSaleById
} from "../../controllers/v1/flash-sale.controller";

const router = Router();

router.get(
  "/",
  getTopPriorityFlashSaleRandom
);

router.get(
  "/:slug",
  getFlashSaleById
);

export default router;