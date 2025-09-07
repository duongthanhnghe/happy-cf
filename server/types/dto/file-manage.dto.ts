export interface FileManageImage {
  url: string
  public_id: string
  format: string
  created_at: string
  bytes: number
  width: number
  height: number
}

export interface FileManageFolder {
  id: string
  title: string
  path: string
  segments: string[]
  children: FileManageFolder[]
}