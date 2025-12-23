import { Router } from "express";
import { getAllProductReviews, getProductReviewById, updateProductReviewStatus, deleteProductReview, } from '../../../controllers/v1/admin/product-review.controller.js';
import { authenticateAdmin } from '../../../middlewares/authenticate-admin.js';
const router = Router();
router.get("/", authenticateAdmin, getAllProductReviews);
router.get("/:id", authenticateAdmin, getProductReviewById);
router.put("/status", authenticateAdmin, updateProductReviewStatus);
router.delete("/:id", authenticateAdmin, deleteProductReview);
export default router;
//# sourceMappingURL=product-review.router.js.map