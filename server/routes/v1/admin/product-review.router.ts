import { Router } from "express";
import {
  getAllProductReviews,
  getProductReviewById,
  updateProductReviewStatus,
  deleteProductReview,
} from '../../../controllers/v1/admin/product-review.controller'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'

const router = Router();

router.get("/", authenticateAdmin, getAllProductReviews);
router.get("/:id", authenticateAdmin, getProductReviewById);
router.put("/status", authenticateAdmin, updateProductReviewStatus);
router.delete("/:id", authenticateAdmin, deleteProductReview);

export default router;