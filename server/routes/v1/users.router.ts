import express from 'express'
import { 
  logSearchKeyword,
  getTopSearchKeyword,
  getAllMembershipLevel,
  getMembershipLevelById,
} from '../../controllers/v1/users.controller'

const router = express.Router()

router.post('/search-keywords/log', logSearchKeyword)
router.get('/search-keywords/list', getTopSearchKeyword)

router.get('/membership-level', getAllMembershipLevel)
router.get('/membership-level/:id', getMembershipLevelById)

export default router
