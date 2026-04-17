import { Router } from 'express';
import { authenticateSeller } from '../middleware/auth.middleware.js';
import upload from '../middleware/storage.middleware.js';
import { createProduct } from '../controller/product.controller.js';
import { productValidator } from '../validator/product.validator.js';


const productRouter = Router();


/**
 * @routes POST /api/products/ 
 * @description Create new producet by seller
 * @access Protected
 */
productRouter.post('/', authenticateSeller, upload.array('images', 7), productValidator, createProduct);


export default productRouter;