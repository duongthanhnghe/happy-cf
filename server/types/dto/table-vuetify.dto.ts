export interface SortBy { key: string; order: 'asc' | 'desc' }

export interface TableOpt {
  page: number
  itemsPerPage: number
  sortBy: SortBy[]
}

export interface TableHeaders {
  title: string
  key: string
  sortable: boolean
}

export interface FilterTime {
  fromDay: string | Date | null
  toDay: string | Date | null
}