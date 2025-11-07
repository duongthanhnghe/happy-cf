import express from 'express'
import { 
  logSearchKeyword,
  getTopSearchKeyword,
} from '../../controllers/v1/users.controller'

const router = express.Router()

router.post('/search-keywords/log', logSearchKeyword)
router.get('/search-keywords/list', getTopSearchKeyword)

export default router
