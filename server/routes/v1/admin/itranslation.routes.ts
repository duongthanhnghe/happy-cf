import { Router } from "express";
import {
  getTranslations,
  createTranslation,
  updateTranslation,
  deleteTranslation,
  getTranslationDetail
} from "../../../controllers/v1/admin/itranslation.controller";
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'

const router = Router();

router.get("/", getTranslations);

router.post("/", createTranslation);
router.put("/:id", authenticateAdmin, updateTranslation);
router.get("/:id", authenticateAdmin, getTranslationDetail);
router.delete("/:id", authenticateAdmin, deleteTranslation);

export default router;
