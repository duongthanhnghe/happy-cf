import { Router } from "express";
import {
  getProductReviewById,
  submitProductReview,
  getReviewsByUser,
  getReviewsByProduct,
} from '../../controllers/v1/product-review.controller'
import { authenticate } from '../../middlewares/authenticate'
import { validate } from '../../middlewares/validate/validate'
import { createProductReviewSchema } from '../../../shared/validate/schemas/product-review.schema'

const router = Router();

router.get("/:id", getProductReviewById);
router.get("/user/:userId/reviews", authenticate, getReviewsByUser); 
router.get("/product/:productId/reviews", getReviewsByProduct); 
router.put("/submit", authenticate, validate(createProductReviewSchema), submitProductReview); 

export default router;