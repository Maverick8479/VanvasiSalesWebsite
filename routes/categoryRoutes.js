import express from 'express'
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from '../controllers/categoryController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'

const router = express.Router()

//routes
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);
router.put('/update-category/:id',requireSignIn,isAdmin, updateCategoryController);

//getall categories
router.get('/get-category', categoryController);

//single category
router.get('/single-category/:slug', singleCategoryController)

//delete category
router.delete('./delete-category/:id', requireSignIn,isAdmin,deleteCategoryController);
export default router