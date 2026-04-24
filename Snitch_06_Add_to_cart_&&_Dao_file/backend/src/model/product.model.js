import mongoose from "mongoose";
import priceSchema from "./price.model.js";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    variants: {
      type: [
        {
          images: [
            {
              url: {
                type: String,
                required: true,
              },
            },
          ],
          stock: {
            type: Number,
            default: 0,
            min: 0,
          },
          attributes: {
            type: Map,
            of: String,
          },
          price: {
            type: priceSchema,
            required: true
          }
        },
      ],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one variant is required",
      },
    },
  },
  {
    timestamps: true,
  },
);

const productModel = mongoose.model("Product", productSchema);
export default productModel;
