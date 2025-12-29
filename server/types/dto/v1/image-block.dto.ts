import {
  IMAGE_BLOCK_PAGES,
  IMAGE_BLOCK_POSITIONS,
} from '../../../shared/constants/image-block'

export type ImageBlockPage =
  typeof IMAGE_BLOCK_PAGES[keyof typeof IMAGE_BLOCK_PAGES]

export type ImageBlockPosition =
  typeof IMAGE_BLOCK_POSITIONS[keyof typeof IMAGE_BLOCK_POSITIONS]

export interface ImageBlockDTO {
  id: string

  image: string
  title?: string
  description?: string

  textButton?: string
  linkRedirect?: string

  page: ImageBlockPage
  position: ImageBlockPosition
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
    'id' | 'order' | 'createdAt' | 'updatedAt'
  >
>
