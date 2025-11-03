export interface ProvinceDTO {
  PROVINCE_ID: number
  PROVINCE_NAME: string
  PROVINCE_CODE: string
}

export interface DistrictDTO {
  DISTRICT_ID: number
  DISTRICT_NAME: string
  DISTRICT_VALUE: string
  PROVINCE_ID: number
}

export interface WardDTO {
  WARDS_ID: number
  WARDS_NAME: string
  DISTRICT_ID: string
}