import { json } from "express";
import productModel from "../model/product.model.js";
import { uploadFile } from "../service/storage.service.js";

export const createProduct = async (req, res, next) => {
  const { title, description, priceAmount, priceCurrency } = req.body;
  const seller = req.user;

  try {
    const images = await Promise.all(
      req.files.map(async (file) => {
        return await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });
      }),
    );

    const product = await productModel.create({
      title,
      description,
      seller: seller._id,
      price: {
        amount: priceAmount,
        currency: priceCurrency,
      },
      images,
    });

    return res.status(201).json({
      message: "Product created successfully!",
      success: true,
      product,
    });
  } catch (error) {
    next();
  }
};

export const getSellerProducts = async (req, res, next) => {
  const seller = req.user;
  console.log(seller);

  try {
    const products = await productModel.find({
      seller: seller._id,
    });

    res.status(200).json({
        success: true,
        message: "Products fetched successfully!",
        products
    });
  } catch (error) {
    next();
  }
};

export const getAllProduct = async (req, res, next) => {
  try {
    const products = await productModel.find();

    return res.status(200).json({
      message: "Product fetched successfully!",
      success: true,
      products,
    })
  } catch (error) {
    next();
  }
}

export const getProductById = async (req, res, next) => {
  console.log(req.params);
  console.log(req);
  const id = req.params.productId;

  try {
    const product = await productModel.find({
      _id: id
    });

    return res.status(200).json({
      success: false,
      message: "Product fetched successfully!",
      product,
    })
  } catch (error) {
    next();
  }
}

export const addProductVarient = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    const product = await productModel.findOne({
      _id: productId,
      seller: req.user._id
    });

    console.log(product);

    if(!product){
      return res.status(400).json({
        success: false,
        message: "Product not found!"
      })
    }

    const files = req.files;
    const images = [];

    if(files || files.length !== 0){
      (await Promise.all(files.map( async (file) => {
        const image = await uploadFile({buffer: file.buffer, fileName: file.originalname});
        return image;
      }))).map((image) => images.push(image));
    }

    const price = req.body.priceAmount;
    const stock = req.body.stock;
    const attributes = JSON.parse(req.body.attributes || '{}');

    product.varients.push({
      images,
      stock,
      price: {
        amount: Number(price) || product.price.amount,
        currency: req.body.priceCurrency || product.price.currency,
      },
      attributes,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Varient added successfully!",
      product,
    })
    
  } catch (error) {
    console.log(error);
    const err = new Error('Internal Server Error');
    err.statusCode = 500;
    return next(err);
  }
}