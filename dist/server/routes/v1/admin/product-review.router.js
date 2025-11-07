import { Router } from "express";
import { getAllProductReviews, getProductReviewById, updateProductReviewStatus, deleteProductReview,
// submitProductReview,
// getReviewsByUser,
// getReviewsByProduct,
 } from '../../../controllers/v1/admin/product-review.controller.js';
import { authenticateAdmin } from '../../../middlewares/authenticate-admin.js';
const router = Router();
router.get("/", authenticateAdmin, getAllProductReviews);
router.get("/:id", getProductReviewById);
// router.get("/user/:userId/reviews", getReviewsByUser); 
// router.get("/product/:productId/reviews", getReviewsByProduct); 
router.put("/status", authenticateAdmin, updateProductReviewStatus);
// router.put("/submit", submitProductReview); 
router.delete("/:id", authenticateAdmin, deleteProductReview);
export default router;
//# sourceMappingURL=product-review.router.js.map