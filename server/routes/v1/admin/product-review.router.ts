import { Router } from "express";
import {
  getAllProductReviews,
  getProductReviewById,
  updateProductReviewStatus,
  deleteProductReview,
} from '../../../controllers/v1/admin/product-review.controller'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'
import { validate } from '../../../middlewares/validate/validate'
import { reviewIdParamSchema } from '../../../../shared/validate/schemas/product-review.schema'

const router = Router();

router.get("/", authenticateAdmin, getAllProductReviews);
router.get("/:id", authenticateAdmin, getProductReviewById);
router.put("/status", authenticateAdmin, updateProductReviewStatus);
router.delete("/:id", authenticateAdmin, validate(reviewIdParamSchema, 'params'), deleteProductReview);

export default router;