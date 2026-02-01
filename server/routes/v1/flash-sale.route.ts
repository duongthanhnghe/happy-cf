import { Router } from "express";
import {
  getTopPriorityFlashSaleRandom
} from "../../controllers/v1/flash-sale.controller";

const router = Router();

router.get(
  "/",
  getTopPriorityFlashSaleRandom
);

export default router;