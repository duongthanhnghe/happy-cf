import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ACCOUNT_ROLES, ACCOUNT_ROLES_CONST } from "../../types/dto/v1/account.dto.js";
const AccountSchema = new Schema({
    avatar: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ACCOUNT_ROLES, default: ACCOUNT_ROLES_CONST.EDITOR },
    active: { type: Boolean, default: true },
    lastLogin: { type: Date },
}, { timestamps: true });
AccountSchema.plugin(mongoosePaginate);
export const AccountModel = mongoose.model("Account", AccountSchema, "admin_accounts");
//# sourceMappingURL=account.entity.js.map