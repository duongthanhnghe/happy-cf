import { Schema, model } from "mongoose";
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
const ListImageSchema = new Schema({
    id: { type: String, required: true },
    src: { type: String, required: true },
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
    listImage: { type: [ListImageSchema], default: [] },
    options: { type: [OptionSchema], default: [] },
    categoryId: { type: Schema.Types.ObjectId, ref: "CategoryProduct", required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
const CategoryProductSchema = new Schema({
    categoryName: { type: String, required: true, trim: true },
    description: { type: String },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
export const ProductEntity = model("Product", ProductSchema, "products");
export const CategoryProductEntity = model("CategoryProduct", CategoryProductSchema, "product_categories");
//# sourceMappingURL=ProductEntity.js.map