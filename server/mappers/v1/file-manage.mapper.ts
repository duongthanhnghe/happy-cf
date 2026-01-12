import type { FileManageFolder, FileManageImage } from '@/server/types/dto/v1/file-manage.dto'

export const toFileManageImageDTO = (item: any): FileManageImage => {
  return {
    url: item.secure_url,
    public_id: item.public_id,
    format: item.format,
    created_at: item.created_at,
    bytes: item.bytes,
    width: item.width,
    height: item.height,
    folder: item.folder,
  }
}

export const toFileManageImageListDTO = (items: any[]): FileManageImage[] => {
  return items.map(toFileManageImageDTO)
}

export const toFileManageFolderDTO = (item: any): FileManageFolder => {
  return {
    id: item.id,
    title: item.title,
    path: item.path,
    segments: item.segments,
    children: item.children
      ? item.children.map(toFileManageFolderDTO)
      : [],
  }
}

export const toFileManageFolderListDTO = (
  items: any[]
): FileManageFolder[] => {
  return items.map(toFileManageFolderDTO)
}
