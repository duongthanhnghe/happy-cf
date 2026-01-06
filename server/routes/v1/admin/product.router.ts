import { Router } from 'express'
import {
  getAllProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProducts,
  toggleActive,
  importProducts,
  exportProducts,
  updateImportProducts,
} from '../../../controllers/v1/admin/product.controller'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'
import { uploadExcel } from '../../../middlewares/uploadExcel'
import { validate } from '../../../middlewares/validate/validate'
import { updateProductSchema, createProductSchema, objectIdParamSchema, deleteProductsSchema } from '../../../../shared/validate/schemas/product.schema'

const router = Router()

router.get('/', authenticateAdmin, getAllProduct)
router.post('/', authenticateAdmin, validate(createProductSchema), createProduct)
router.post('/delete-many',    authenticateAdmin, deleteProducts)
router.post("/import", authenticateAdmin, uploadExcel, importProducts);
router.post("/updateImport", authenticateAdmin, uploadExcel, updateImportProducts);
router.get("/export", authenticateAdmin, exportProducts);
router.get('/:id',       authenticateAdmin, validate(objectIdParamSchema, 'params'), getProductById)
router.put('/:id',       authenticateAdmin, validate(objectIdParamSchema, 'params'), validate(updateProductSchema), updateProduct)
router.delete('/:id',    authenticateAdmin, validate(objectIdParamSchema, 'params'), deleteProduct)
router.patch('/toggleActive/:id', authenticateAdmin, validate(objectIdParamSchema, 'params'), toggleActive)

export default router
