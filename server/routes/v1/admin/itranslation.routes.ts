import { Router } from "express";
import {
  getTranslations,
  createTranslation,
  updateTranslation,
  deleteTranslation,
  getTranslationDetail
} from "../../../controllers/v1/admin/itranslation.controller";
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'
import { validate } from '../../../middlewares/validate/validate'
import { createTranslationSchema, updateTranslationSchema, translationIdParamSchema } from '../../../../shared/validate/schemas/itranslation.schema'

const router = Router();

router.get("/", getTranslations);
router.post("/", validate(createTranslationSchema),createTranslation);
router.put("/:id", authenticateAdmin, validate(updateTranslationSchema),updateTranslation);
router.get("/:id", getTranslationDetail);
router.delete("/:id", authenticateAdmin, validate(translationIdParamSchema, 'params'), deleteTranslation);

export default router;
