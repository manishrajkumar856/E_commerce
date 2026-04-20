import { Router } from 'express';
import { authenticateSeller } from '../middleware/auth.middleware.js';
import upload from '../middleware/storage.middleware.js';
import { addProductVarient, createProduct, getAllProduct, getProductById, getSellerProducts } from '../controller/product.controller.js';
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



/**
 * @routes GET /api/products/
 * @description Get all the products list
 * @access Public
 */
productRouter.get('/', getAllProduct);



/**
 * @routes GET /api/products/
 * @description Get single product
 * @access Public
 */
productRouter.get('/:productId', getProductById);



/**
 * @routes GET /api/products/:productId/addVarient
 * @description Add new varient to the  product
 * @access Public
 */
productRouter.post('/:productId/addVarient', authenticateSeller, upload.array('images', 7), addProductVarient);



export default productRouter;