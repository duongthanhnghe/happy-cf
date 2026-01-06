import type { PaginationDTO } from "./pagination.dto";

export interface ApiResponse<T> {
  code: number;
  message?: string;
  data: T;
}

// export interface ApiPaginationResponse<T> {
//   code: number;
//   message?: string;
//   data: T[];
//   pagination: PaginationDTO
// }