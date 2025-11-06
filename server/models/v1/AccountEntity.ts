import mongoose, { Schema, Document, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import type { AccountRoleType } from "@/server/types/dto/v1/account.dto";
import { ACCOUNT_ROLES, ACCOUNT_ROLES_CONST } from "../../types/dto/v1/account.dto";

export interface AccountDocument extends Document {
  _id: Types.ObjectId;
  avatar: string;
  fullname: string;
  email: string;
  password: string;
  role: AccountRoleType;
  active: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const AccountSchema = new Schema<AccountDocument>(
  {
    avatar: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ACCOUNT_ROLES, default: ACCOUNT_ROLES_CONST.EDITOR },
    active: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

AccountSchema.plugin(mongoosePaginate);

export const AccountModel = mongoose.model<AccountDocument>(
  "Account",
  AccountSchema,
  "admin_accounts"
);
