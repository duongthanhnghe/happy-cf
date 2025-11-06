import mongoose, { Schema } from "mongoose";
const AdminAccountSchema = new Schema({
    avatar: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "editor"], default: "editor" },
    active: { type: Boolean, default: true },
    lastLogin: { type: Date },
}, { timestamps: true });
export const AdminAccountModel = mongoose.model("AdminAccount", AdminAccountSchema, "admin_accounts");
//# sourceMappingURL=AdminAccountEntity.js.map