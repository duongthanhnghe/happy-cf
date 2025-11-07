import { Router } from "express";
import { 
// getAllProductReviews,
getProductReviewById, 
// updateProductReviewStatus,
// deleteProductReview,
submitProductReview, getReviewsByUser, getReviewsByProduct, } from '../../controllers/v1/product-review.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';
const router = Router();
// router.get("/", getAllProductReviews);
router.get("/:id", getProductReviewById);
router.get("/user/:userId/reviews", authenticate, getReviewsByUser);
router.get("/product/:productId/reviews", getReviewsByProduct);
// router.put("/status", updateProductReviewStatus);
router.put("/submit", authenticate, submitProductReview);
// router.delete("/:id", deleteProductReview);
export default router;
//# sourceMappingURL=productReviewRouter.js.map