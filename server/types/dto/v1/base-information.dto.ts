export interface SocialLinkDTO {
  name: string
  icon: string
  src: string
}

export interface RewardConfigDTO {
  enableEarnPoint: boolean
  enableUsePoint: boolean
  rateUsePoint: number
}

export interface FreeShippingConfigDTO {
  enabled: boolean;
  minOrderAmount: number;
}

export interface SystemConfigDTO {
  reward: RewardConfigDTO
  shipping: FreeShippingConfigDTO
}

export interface BaseInformationDTO {
  name: string
  logoUrl: string
  phone: string
  email: string
  address: string
  openingHours: string
  socialLinks: SocialLinkDTO[]
  description?: string
  provinceCode?: number
  districtCode?: number
  wardCode?: number
  systemConfig: SystemConfigDTO;
  createdAt: string
  updatedAt: string
}

export type UpdateBaseInformationBody = Omit<
  BaseInformationDTO,
  "createdAt" | "updatedAt"
>
