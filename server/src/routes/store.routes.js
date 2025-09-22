import express from 'express'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { addNewStore, addOrUpdateRating, getAllStores, getStoreDatawithUserRatings } from '../controllers/store.controller.js'

const router = express.Router()




router.get('/get-all',verifyToken,getAllStores)
router.get('/get-store-details',verifyToken,getStoreDatawithUserRatings)
router.post('/add-store',verifyToken,addNewStore)
router.post('/edit-rating',verifyToken,addOrUpdateRating)


export default router