import { Schema, model } from "mongoose";
const MembershipSchema = new Schema({
    level: { type: String, enum: ["Bronze", "Silver", "Gold", "Platinum"], required: true },
    point: { type: Number, default: 0 },
    discountRate: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    barcode: { type: String },
    code: { type: Number },
}, { _id: false });
const UserSchema = new Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    phone: { type: String },
    birthday: { type: Date },
    avatar: { type: String },
    active: { type: Boolean, default: true },
    role: { type: Number, default: 0 },
    membership: { type: MembershipSchema, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
}, { timestamps: true });
export const UserModel = model("User", UserSchema, "users");
//# sourceMappingURL=UserModel.js.map