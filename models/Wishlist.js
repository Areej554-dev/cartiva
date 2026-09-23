import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    products: [
      {
        productId: {
          type: String,
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        image: {
          type: String,
        },

        category: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wishlist =
  mongoose.models.Wishlist ||
  mongoose.model("Wishlist", WishlistSchema);

export default Wishlist;