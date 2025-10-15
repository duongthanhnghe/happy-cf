import mongoose, { Schema, model, Types, Document } from "mongoose";
import type { TagAddress } from "@/server/types/dto/v1/address.dto";

export interface Address extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  fullname: string;
  phone: string;
  address: string;
  note?: string;
  tag: TagAddress;
  isDefault: boolean;
  provinceCode: number;
  districtCode: number;
  wardCode: number;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<Address>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String },
    tag: { 
      type: String, 
      enum: ["Nhà", "Công ty", "Trường học", "Khác"],
      default: "Khác" 
    },
    isDefault: { type: Boolean, default: false },
    provinceCode: { type: Number, required: true },
    districtCode: { type: Number, required: true },
    wardCode: { type: Number, required: true },
  },
  { timestamps: true }
);

export const AddressModel = model("Address", AddressSchema, "addresses");

// import mongoose, { Schema, model, Types } from "mongoose";
// import type { TagAddress } from "@/server/types/dto/address.dto";

// export interface Address extends Document {
//   _id: Types.ObjectId;
//   userId: Types.ObjectId;
//   fullname: string;
//   phone: string;
//   address: string;
//   note?: string;
//   tag: TagAddress;
//   isDefault: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const AddressSchema = new Schema<Address>(
//   {
//     userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     fullname: { type: String, required: true },
//     phone: { type: String, required: true },
//     address: { type: String, required: true },
//     note: { type: String },
//     tag: { 
//       type: String, 
//       enum: ["Nhà", "Công ty", "Trường học", "Khác"],
//       default: "Khác" 
//     },
//     isDefault: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// export const AddressModel = model("Address", AddressSchema, "addresses");
