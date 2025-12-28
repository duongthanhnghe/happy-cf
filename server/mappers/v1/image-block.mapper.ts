import type { ImageBlock } from '@/server/models/v1/image-block.entity'
import type { ImageBlockDTO } from '@/server/types/dto/v1/image-block.dto'

export const toImageBlockDTO = (entity: ImageBlock): ImageBlockDTO => ({
  id: entity._id.toString(),
  image: entity.image,
  title: entity.title,
  description: entity.description,
  textButton: entity.textButton,
  linkRedirect: entity.linkRedirect,
  page: entity.page,
  position: entity.position,
  order: entity.order,
  isActive: entity.isActive,
  createdAt: entity.createdAt.toISOString(),
  updatedAt: entity.updatedAt.toISOString(),
})

export const toImageBlockListDTO = (items: ImageBlock[]): ImageBlockDTO[] => {
  return items.map(toImageBlockDTO)
}
