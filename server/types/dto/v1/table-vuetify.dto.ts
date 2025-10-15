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
  headerProps?: Record<string, any> | ((header: TableHeaders) => Record<string, any>)
  cellProps?: Record<string, any> | ((data: { item: any; value: any }) => Record<string, any>)
}

export interface FilterTime {
  fromDay: string | Date | null
  toDay: string | Date | null
}