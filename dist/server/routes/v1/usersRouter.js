import express from 'express';
import { logSearchKeyword, getTopSearchKeyword, } from '../../controllers/v1/usersController.js';
const router = express.Router();
router.post('/search-keywords/log', logSearchKeyword);
router.get('/search-keywords/list', getTopSearchKeyword);
export default router;
//# sourceMappingURL=usersRouter.js.map