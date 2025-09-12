export interface PaginationMeta {
  page: number 
  limit: number 
  total: number
  totalPages: number
}

export interface PaginationDTO<T> {
  code?: number
  data: T[]
  pagination: PaginationMeta
  message?: string
}
