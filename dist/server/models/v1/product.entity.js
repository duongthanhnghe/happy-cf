import { Schema, model } from "mongoose";
const ListImageSchema = new Schema({
    id: { type: String, required: true },
    src: { type: String, required: true },
}, { _id: false });
// MỚI: Schema cho Selected Variant
const ProductSelectedVariantSchema = new Schema({
    variantId: { type: String, required: true },
    variantName: { type: String, required: true },
    priceModifier: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    sku: { type: String, required: true },
}, { _id: false });
// MỚI: Schema cho Variant Group trong Product
const ProductVariantGroupSchema = new Schema({
    groupId: { type: String, required: true },
    groupName: { type: String, required: true },
    required: { type: Boolean, default: false },
    selectedVariants: { type: [ProductSelectedVariantSchema], default: [] },
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
    variantGroups: { type: [ProductVariantGroupSchema], default: [] },
    categoryId: { type: Schema.Types.ObjectId, ref: "CategoryProduct", required: true },
    weight: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    titleSEO: {
        type: String,
        trim: true,
        required: true,
    },
    descriptionSEO: {
        type: String,
        maxlength: 160,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang']
    },
    keywords: {
        type: [String],
        default: []
    }
}, { timestamps: true });
const CategoryProductSchema = new Schema({
    categoryName: { type: String, required: true, trim: true },
    description: { type: String },
    image: { type: String, required: true },
    banner: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    parentId: { type: Schema.Types.ObjectId, ref: "CategoryProduct", default: null },
    titleSEO: {
        type: String,
        trim: true,
        required: true,
    },
    descriptionSEO: {
        type: String,
        maxlength: 160,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang']
    },
    keywords: {
        type: [String],
        default: []
    }
}, { timestamps: true });
export const ProductEntity = model("Product", ProductSchema, "products");
export const CategoryProductEntity = model("CategoryProduct", CategoryProductSchema, "product_categories");
//# sourceMappingURL=product.entity.js.map