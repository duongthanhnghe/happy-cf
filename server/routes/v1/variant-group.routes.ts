import { Router } from 'express';
import {
  getVariantGroups,
} from '../../controllers/v1/variant-group.controller';

const router = Router();
router.get('/', getVariantGroups);

export default router;