import { Schema, model } from "mongoose";
const WishlistSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    createdAt: { type: Date, default: Date.now },
}, { versionKey: false });
export const WishlistModel = model("Wishlist", WishlistSchema, "wishlists");
//# sourceMappingURL=wishlist.entity.js.map