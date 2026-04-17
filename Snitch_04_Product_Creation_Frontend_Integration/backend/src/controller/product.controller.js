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
