import express from 'express'
import { changepass, checkauth, getAdminDashboardStats, getAllUsers, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = express.Router()




router.post('/login',loginUser)
router.get('/logout',verifyToken,logoutUser)
router.post('/register',registerUser)
router.post('/change-password',verifyToken,changepass)
router.get('/get-allusers',verifyToken,getAllUsers)
router.get('/get-admin-data',verifyToken,getAdminDashboardStats)

router.get('/me',verifyToken,checkauth)


export default router