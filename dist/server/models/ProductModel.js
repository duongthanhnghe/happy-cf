import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const VariantSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    priceModifier: { type: Number, default: null },
    inStock: { type: Boolean, default: true },
}, { _id: false });
const OptionSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    required: { type: Boolean, default: false },
    variants: { type: [VariantSchema], default: [] },
}, { _id: false });
const ProductSchema = new Schema({
    productName: { type: String, required: true, trim: true },
    description: { type: String },
    summaryContent: { type: String },
    price: { type: Number, default: null },
    priceDiscounts: { type: Number, default: null },
    amount: { type: Number, default: null },
    amountOrder: { type: Number, default: 0 },
    image: { type: String, required: true },
    options: { type: [OptionSchema], default: [] },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "CategoryProduct", required: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
export const ProductModel = models.Product || model("Product", ProductSchema, "products");
const CategoryProductSchema = new Schema({
    categoryName: { type: String, required: true, trim: true },
    description: { type: String },
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
export const CategoryProductModel = models.CategoryProduct ||
    model("CategoryProduct", CategoryProductSchema, "product_categories");
//# sourceMappingURL=ProductModel.js.map