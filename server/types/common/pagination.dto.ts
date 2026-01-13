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
  success?: boolean
}

export const paginationError = <T>(
  page: number,
  limit: number,
  err: any,
  message?: string
): PaginationDTO<T> => ({
  code: 1,
  message: message ?? err.message ?? 'Request failed',
  data: [],
  pagination: { page, limit, total: 0, totalPages: 0 },
});
