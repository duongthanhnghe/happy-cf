import mongoose, { Schema, model, Types } from "mongoose";

export interface SocialLink {
  name: string;
  icon: string;
  src: string;
}

export interface RewardConfig {
  enableEarnPoint: boolean;   // tích điểm khi mua hàng
  enableUsePoint: boolean;    // dùng điểm khi thanh toán
  rateUsePoint: number;
}

export interface ShippingConfig {
  enabled: boolean;          // bật / tắt freeship
  minOrderAmount: number;    // đơn tối thiểu để freeship
}

export interface SystemConfig {
  reward: RewardConfig;
  shipping: ShippingConfig;
}

export interface BaseInformation {
  _id: Types.ObjectId;
  name: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  socialLinks: SocialLink[];
  description?: string;
  provinceCode?: number;
  districtCode?: number;
  wardCode?: number;
  systemConfig: SystemConfig;
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema = new Schema<SocialLink>(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    src: { type: String, required: true },
  },
  { _id: false }
);


const RewardConfigSchema = new Schema(
  {
    enableEarnPoint: { type: Boolean, default: true },
    enableUsePoint: { type: Boolean, default: true },
    rateUsePoint: { type: Number, default: 0 },
  },
  { _id: false }
)

const ShippingConfigSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    minOrderAmount: { type: Number, default: 0 },
  },
  { _id: false }
)

const SystemConfigSchema = new Schema(
  {
    reward: {
      type: RewardConfigSchema,
      default: () => ({})
    },
    shipping: {
      type: ShippingConfigSchema,
      default: () => ({})
    }
  },
  { _id: false }
)

const BaseInformationSchema = new Schema<BaseInformation>(
  {
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    openingHours: { type: String, required: true },
    socialLinks: { type: [SocialLinkSchema], default: [] },
    description: { type: String },
    provinceCode: { type: Number },
    districtCode: { type: Number },
    wardCode: { type: Number },
    systemConfig: {
      type: SystemConfigSchema,
      default: () => ({})
    }
  },
  { timestamps: true }
);

export const BaseInformationEntity = model<BaseInformation>(
  "BaseInformation",
  BaseInformationSchema,
  "base_information"
);
