import mongoose from "mongoose";

const priceSchema = new mongoose.Schema(
  {
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "JPY", "INR"],
      default: "INR",
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
    _ver: false,
  },
);


export default priceSchema;