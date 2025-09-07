export interface BannerDTO {
  id: string
  title: string
  description?: string
  image: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type IdBanner = { id: string }
export type CreateBannerBody = Omit<BannerDTO, "id" | "createdAt" | "updatedAt"| "order">
export type UpdateBannerBody = Partial<Omit<CreateBannerBody, "createdAt" | "updatedAt">>
