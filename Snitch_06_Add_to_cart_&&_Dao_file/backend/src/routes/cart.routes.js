import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateAddToCart } from '../validator/addCart.validator.js';
import { addToCart, decrementCartItem, getCart, incrementCartItem, removeFromCart } from '../controller/cart.controller.js';

const cartRouter = Router();


/**
 * @Route POST /api/cart/add/:productId/:variantId
 * @Description Add a product variant to the cart
 * @Access Private
 * @arguments
 * - productId: ID of the product to add
 * - variantId: ID of the product variant to add
 */
cartRouter.post('/add/:productId/:variantId', authenticateUser, validateAddToCart, addToCart);

/**
 * @Route GET /api/cart/
 * @Description Get the current user's cart
 * @Access Private
 */

cartRouter.get('/', authenticateUser, getCart);


/**
 * @Route Patch /api/cart/update/increment/:productId/:variantId
 * @Description Increment the quantity of a product variant in the cart
 * @Access Private
 */
cartRouter.patch('/update/increment/:productId/:variantId', authenticateUser, incrementCartItem);


/**
 * @Route Patch /api/cart/update/decrement/:productId/:variantId
 * @Description Decrement the quantity of a product variant in the cart
 * @Access Private
 */
cartRouter.patch('/update/decrement/:productId/:variantId', authenticateUser, decrementCartItem);

/**
 * @Route DELETE /api/cart/remove/:productId/:variantId
 * @Description Remove a product variant from the cart
 * @Access Private
 */
cartRouter.delete('/remove/:productId/:variantId', authenticateUser, removeFromCart);


export default cartRouter;