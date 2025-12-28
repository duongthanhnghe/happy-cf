export interface ImageBlockDTO {
  id: string

  image: string
  title?: string
  description?: string

  textButton?: string
  linkRedirect?: string

  page: string
  position: string
  order: number
  isActive: boolean

  createdAt: string
  updatedAt: string
}

export type CreateImageBlockBody = Omit<
  ImageBlockDTO,
  'id' | 'order' | 'createdAt' | 'updatedAt'
>

export type UpdateImageBlockBody = Partial<
  Omit<
    ImageBlockDTO,
    'id' | 'page' | 'position' | 'order' | 'createdAt' | 'updatedAt'
  >
>