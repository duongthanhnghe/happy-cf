import { Router } from "express";
import {
  getAllProductReviews,
  getProductReviewById,
  updateProductReviewStatus,
  deleteProductReview,
  // submitProductReview,
  // getReviewsByUser,
  // getReviewsByProduct,
} from '../../../controllers/v1/admin/productReviewController'
import { authenticateAdmin } from '../../../middlewares/authenticateAdmin'

const router = Router();

router.get("/", authenticateAdmin, getAllProductReviews);
router.get("/:id", getProductReviewById);
// router.get("/user/:userId/reviews", getReviewsByUser); 
// router.get("/product/:productId/reviews", getReviewsByProduct); 
router.put("/status", authenticateAdmin, updateProductReviewStatus);
// router.put("/submit", submitProductReview); 
router.delete("/:id", authenticateAdmin, deleteProductReview);

export default router;