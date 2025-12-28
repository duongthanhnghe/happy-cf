import { Router } from 'express'
import {
 getAllImageBlocks,
//  getImageBlocksByPage,
 getImageBlockById,
 createImageBlock,
 updateImageBlock,
 deleteImageBlock,
 updateImageBlockOrder,
 toggleImageBlockActive,
} from '../../../controllers/v1/admin/image-block.controller'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'

const router = Router()

router.get("/", authenticateAdmin, getAllImageBlocks)
// router.get("/by-page", getImageBlocksByPage)
router.get("/:id", authenticateAdmin, getImageBlockById)

router.post("/", authenticateAdmin, createImageBlock)
router.put("/:id", authenticateAdmin, updateImageBlock)
router.delete("/:id", authenticateAdmin, deleteImageBlock)

router.patch("/:id/order", authenticateAdmin, updateImageBlockOrder)
router.patch("/:id/toggle-active", authenticateAdmin, toggleImageBlockActive)

export default router