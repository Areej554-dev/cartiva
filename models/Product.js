import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: 10,
      min: 0,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", ProductSchema, "products");

export default Product;