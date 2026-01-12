import type { ApiResponse } from "../../common/api-response"

export interface CursorPaginationDTO<T> {
  success: boolean
  data: T[]
  message?: string
  limit?: number
  next_cursor: string | null
}

export interface FileManageImage {
  url: string
  public_id: string
  format: string
  created_at: string
  bytes: number
  width: number
  height: number
  folder?: string
}

export interface FileManageFolder {
  id: string
  title: string
  path: string
  segments: string[]
  children: FileManageFolder[]
}

export type GetImagesResponse =
  CursorPaginationDTO<FileManageImage>

export type SearchImagesResponse =
  ApiResponse<FileManageImage[]>

export type UploadImagesResponse =
  ApiResponse<FileManageImage[]>

export type DeleteImageResponse =
  ApiResponse<{ public_id: string }>

  export type DeleteImagesResponse =
  ApiResponse<{ public_id: string[] }>

  export type GetFoldersResponse =
  ApiResponse<FileManageFolder[]>