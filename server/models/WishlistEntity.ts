import mongoose, { Schema, model } from "mongoose"
import { Types } from "mongoose";

export interface WishlistItem {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  createdAt: Date;
}

const WishlistSchema = new Schema<WishlistItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

export const WishlistModel = model("Wishlist", WishlistSchema, "wishlists");
