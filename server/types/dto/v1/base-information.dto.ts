export interface SocialLinkDTO {
  name: string
  icon: string
  src: string
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
  createdAt: string
  updatedAt: string
}

export type UpdateBaseInformationBody = Omit<
  BaseInformationDTO,
  "createdAt" | "updatedAt"
>
