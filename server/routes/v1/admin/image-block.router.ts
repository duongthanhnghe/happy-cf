import { Router } from 'express'
import {
 getAllImageBlocks,
 getImageBlockById,
 createImageBlock,
 updateImageBlock,
 deleteImageBlock,
 updateImageBlockOrder,
 toggleImageBlockActive,
} from '../../../controllers/v1/admin/image-block.controller'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'
import { validate } from '../../../middlewares/validate/validate'
import { createImageBlockSchema, updateImageBlockSchema, imageBlockIdParamSchema } from '../../../../shared/validate/schemas/image-block.schema'

const router = Router()

router.get("/", authenticateAdmin, getAllImageBlocks)
router.get("/:id", authenticateAdmin, getImageBlockById)

router.post("/", authenticateAdmin, validate(createImageBlockSchema), createImageBlock)
router.put("/:id", authenticateAdmin, validate(updateImageBlockSchema), updateImageBlock)
router.delete("/:id", authenticateAdmin, validate(imageBlockIdParamSchema, 'params'), deleteImageBlock)

router.patch("/:id/order", authenticateAdmin, validate(imageBlockIdParamSchema, 'params'), updateImageBlockOrder)
router.patch("/:id/toggle-active", authenticateAdmin, validate(imageBlockIdParamSchema, 'params'), toggleImageBlockActive)

export default router