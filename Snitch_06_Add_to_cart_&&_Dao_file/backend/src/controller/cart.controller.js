import { stockOfVariant } from "../dao/product.dao.js";
import cartModel from "../model/cart.model.js";
import productModel from "../model/product.model.js";

export const addToCart = async (req, res, next) => {
  const { productId, variantId } = req.params;
  const { quantity = 1 } = req.body;

  try {
    const product = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });

    if (!product) {
      const error = new Error("Product or variant not found");
      error.statusCode = 404;
      return next(error);
    }

    const stock = await stockOfVariant(productId, variantId);

    const cart =
      (await cartModel.findOne({ user: req.user._id })) ||
      (await cartModel.create({ user: req.user._id }));

    // Check if the product variant is already in the cart
    const isProductAlreadyInCart = cart.items.some(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId,
    );

    if (isProductAlreadyInCart) {
      const quantityInCart = cart.items.find(
        (item) =>
          item.product.toString() === productId &&
          item.variant.toString() === variantId,
      ).quantity;

      if (quantityInCart + quantity > stock) {
        const error = new Error("Insufficient stock");
        error.statusCode = 400;
        return next(error);
      }

      const cartItem = await cartModel.findOneAndUpdate(
        {
          user: req.user._id,
          "items.product": productId,
          "items.variant": variantId,
        },
        { $inc: { "items.$.quantity": quantity } },
        { new: true },
      );

      return res.status(200).json({
        success: true,
        message: "Product added to cart successfully",
        cart: cartItem,
      });
    }

    if (quantity > stock) {
      const error = new Error("Insufficient stock");
      error.statusCode = 400;
      return next(error);
    }

    cart.items.push({
      product: productId,
      variant: variantId,
      quantity: quantity,
      price: product.variants.find(
        (variant) => variant._id.toString() === variantId,
      ).price,
    });

    await cart.save();
    console.log("Cart:", cart);

    return res.status(200).json({
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    console.log(error);
    const err = new Error("Failed to add product to cart");
    err.statusCode = 500;
    next(err);
  }
};

export const getCart = async (req, res, next) => {
  try {
    let cart = await cartModel
      .findOne({
        user: req.user._id,
      })
      .populate("items.product");

    if (!cart) {
      cart = await cartModel.create({ user: req.user._id });
    }

    return res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      cart,
    });
  } catch (error) {
    console.log(error);
    const err = new Error("Internal Server Error");
    next(err);
  }
};

export const incrementCartItem = async (req, res, next) => {
  const { productId, variantId } = req.params;

  try {

    const product = await productModel.findOne({
      _id: productId,
    });

    if(!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    const cart = await cartModel.findOne({
      user: req.user._id
    });

    if(!cart) {
      const error = new Error("Cart not found");
      error.statusCode = 404;
      return next(error);
    }

    const stock = await stockOfVariant(productId, variantId);
    const cartItemQuantity = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variantId).quantity;
    console.log("Stock:", stock);
    console.log("Cart Item Quantity:", cartItemQuantity);

    if(cartItemQuantity + 1 > stock) {
      const error = new Error("Invalid quantity");
      error.statusCode = 400;
      return next(error);
    }
    


    const cartItem = await cartModel.findOneAndUpdate(
      {
        user: req.user._id,
        "items.product": productId,
        "items.variant": variantId,
      },
      {
        $inc: { "items.$.quantity": 1 },
      },
      { new: true },
    ).populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Cart item quantity incremented successfully",
      cart: cartItem,
    });

  } catch (error) {
    console.log(error);
    const err = new Error("Internal Server Error");
    next(err);
  }
};

export const decrementCartItem = async (req, res, next) => {
  const { productId, variantId } = req.params;

  try {

    const product = await productModel.findOne({
      _id: productId,
    });

    if(!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    const cart = await cartModel.findOne({
      user: req.user._id
    });

    if(!cart) {
      const error = new Error("Cart not found");
      error.statusCode = 404;
      return next(error);
    }

    const stock = await stockOfVariant(productId, variantId);
    const cartItemQuantity = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variantId).quantity;

    if(cartItemQuantity - 1 < 1 || cartItemQuantity - 1 > stock) {
      const error = new Error("Invalid quantity");
      error.statusCode = 400;
      return next(error);
    }

    const cartItem = await cartModel.findOneAndUpdate(
      {
        user: req.user._id,
        "items.product": productId,
        "items.variant": variantId,
      },
      {
        $inc: { "items.$.quantity": -1 },
      },
      { new: true },
    ).populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Cart item quantity decremented  successfully",
      cart: cartItem,
    });
    
  } catch (error) {
    console.log(error);
    const err = new Error("Internal Server Error");
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  const { productId, variantId } = req.params;

  try {
    const cart = await cartModel.findOne({
      user: req.user._id,
      "items.product": productId,
      "items.variant": variantId,
    });

    if(!cart) {
      const error = new Error("Cart not found");
      error.statusCode = 404;
      return next(error);
    }

    const cartItem = await cartModel.findOneAndUpdate(
      {
        user: req.user._id,
        "items.product": productId,
        "items.variant": variantId,
      },
      {
        $pull: { items: { product: productId, variant: variantId } },
      },
      { new: true },
    ).populate("items.product");

    console.log(cartItem);

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      cart: cartItem,
    });
  } catch (error) {
    console.log(error);
    const err = new Error("Internal Server Error");
    next(err);
  }
}