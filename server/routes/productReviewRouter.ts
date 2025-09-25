import { Router } from "express";
import {
  getAllProductReviews,
  getProductReviewById,
  updateProductReviewStatus,
  deleteProductReview,
  submitProductReview,
  getReviewsByUser,
} from "../controllers/productReviewController";

const router = Router();

router.get("/", getAllProductReviews);
router.get("/:id", getProductReviewById);
router.get("/user/:userId/reviews", getReviewsByUser); 
router.put("/status", updateProductReviewStatus);
router.put("/submit", submitProductReview); 
router.delete("/:id", deleteProductReview);

export default router;