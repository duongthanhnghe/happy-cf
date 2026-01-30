import { Router } from "express";
import {
  getAllFlashSales,
  getFlashSaleById,
  createFlashSale,
  updateFlashSale,
  deleteFlashSale,
  toggleActiveFlashSale,
} from "../../../controllers/v1/admin/flash-sale.controller";
import { authenticateAdmin } from "../../../middlewares/authenticate-admin";
import { validate } from "../../../middlewares/validate/validate";
import {
  createFlashSaleSchema,
  updateFlashSaleSchema,
  flashSaleIdParamSchema,
} from "../../../../shared/validate/schemas/flash-sale.schema";

const router = Router();

router.get(
  "/",
  authenticateAdmin,
  getAllFlashSales
);

router.get(
  "/:id",
  authenticateAdmin,
  validate(flashSaleIdParamSchema, "params"),
  getFlashSaleById
);

router.post(
  "/",
  authenticateAdmin,
  validate(createFlashSaleSchema),
  createFlashSale
);

router.put(
  "/:id",
  authenticateAdmin,
  validate(updateFlashSaleSchema),
  updateFlashSale
);

router.delete(
  "/:id",
  authenticateAdmin,
  validate(flashSaleIdParamSchema, "params"),
  deleteFlashSale
);

router.patch(
  "/:id/toggle-active",
  authenticateAdmin,
  validate(flashSaleIdParamSchema, "params"),
  toggleActiveFlashSale
);

export default router;