import type { PaginationDTO } from '../../common/pagination.dto'
export interface CategoryNewsDTO {
  id: string
  categoryName: string
  description?: string
  image?: string
  summaryContent?: string
  order: number
  isActive: boolean
  // SEO
  titleSEO?: string
  descriptionSEO?: string
  slug: string
  keywords?: string[]

  createdAt: string
  updatedAt: string
}

export type CreateCategoryNewsDTO = Omit<CategoryNewsDTO, "id" | "createdAt" | "updatedAt" |"order">

export type UpdateCategoryNewsDTO = Partial<Omit<CreateCategoryNewsDTO, "createdAt" | "updatedAt">>

export type IdCategoryNews = { id: string }

export interface PostNewsDTO {
  id: string
  title: string
  description?: string
  image: string
  summaryContent?: string
  categoryId: string
  isActive: boolean
  views: number
  author: string
  // SEO
  titleSEO: string
  descriptionSEO: string
  slug: string
  keywords?: string[]

  createdAt: string
  updatedAt: string
}

export type CreatePostNewsDTO = Omit<PostNewsDTO, "id" | "createdAt" | "updatedAt" | "views">

export type UpdatePostNewsDTO = Partial<Omit<CreatePostNewsDTO, "author">>

export type IdPostNews = { id: string }

export type PostNewsPaginationDTO = PaginationDTO<PostNewsDTO>