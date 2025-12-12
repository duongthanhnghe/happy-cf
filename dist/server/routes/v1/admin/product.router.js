import { Router } from 'express';
import { getAllProduct, getProductById, createProduct, updateProduct, deleteProduct, deleteProducts, toggleActive, importProducts, exportProducts, updateImportProducts, } from '../../../controllers/v1/admin/product.controller.js';
import { authenticateAdmin } from '../../../middlewares/authenticate-admin.js';
import { uploadExcel } from '../../../middlewares/uploadExcel.js';
const router = Router();
router.get('/', authenticateAdmin, getAllProduct);
router.post('/', authenticateAdmin, createProduct);
router.delete('/', authenticateAdmin, deleteProducts);
router.post("/import", uploadExcel, importProducts);
router.post("/updateImport", uploadExcel, updateImportProducts);
router.get("/export", exportProducts);
router.get('/:id', getProductById);
router.put('/:id', authenticateAdmin, updateProduct);
router.delete('/:id', authenticateAdmin, deleteProduct);
router.patch('/toggleActive/:id', authenticateAdmin, toggleActive);
export default router;
//# sourceMappingURL=product.router.js.map