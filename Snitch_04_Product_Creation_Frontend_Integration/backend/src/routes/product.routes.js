import { Router } from 'express';
import { authenticateSeller } from '../middleware/auth.middleware.js';
import upload from '../middleware/storage.middleware.js';
import { createProduct, getSellerProducts } from '../controller/product.controller.js';
import { productValidator } from '../validator/product.validator.js';


const productRouter = Router();


/**
 * @routes POST /api/products/ 
 * @description Create new producet by seller
 * @access Protected
 */
productRouter.post('/', authenticateSeller, upload.array('images', 7), productValidator, createProduct);


/**
 * @routes GET /api/products/seller
 * @description Get all the products created by that user
 * @access Private
 */
productRouter.get('/seller', authenticateSeller, getSellerProducts);

export default productRouter;