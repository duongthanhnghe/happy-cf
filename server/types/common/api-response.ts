export interface ApiResponse<T> {
  code: number;
  message?: string;
  data: T;
  success?: boolean
}

export enum ApiErrorCode {
  SUCCESS = 0,
  VALIDATION = 1,
  FORBIDDEN = 2,
  TOKEN_EXPIRED = 3,
  NETWORK = -1,
}

export const apiError = <T = null>(err: any): ApiResponse<T> => {
  if (err?.data && typeof err.data === 'object' && 'code' in err.data) {
    return err.data as ApiResponse<T>
  }

  return {
    code: ApiErrorCode.NETWORK,
    message: err?.message || 'Network error',
    data: null as T
  }
}
