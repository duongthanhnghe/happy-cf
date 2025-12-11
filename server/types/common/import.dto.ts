export interface ImportMeta {
  total?: number 
  success?: number 
  fail?: number
  report?: number
}

export interface ImportItemDTO<T> {
  rowIndex?: string;
  status?: string;
  message?: string;
  row: T
}

export interface ImportDTO<T> {
  code?: number
  data: T[]
  summary?: ImportMeta
  message?: string
}
