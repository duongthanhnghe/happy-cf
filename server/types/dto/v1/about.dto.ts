export interface ListImageDTO {
  id: string;
  src: string;
}

export interface AboutDTO {
  id: string
  title: string
  description?: string
  summaryContent?: string
  image: string
  listImage: ListImageDTO[]
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type IdAbout = { id: string }
export type CreateAboutBody = Omit<AboutDTO, "id" | "createdAt" | "updatedAt" | "order">
export type UpdateAboutBody = Partial<Omit<CreateAboutBody, "createdAt" | "updatedAt">>
