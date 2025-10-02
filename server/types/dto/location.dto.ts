export interface ProvinceDTO {
  code: number
  name: string
  division_type?: string
  codename?: string
  phone_code?: string
}

export interface DistrictDTO {
  code: number
  name: string
  division_type?: string
  codename?: string
  province_code?: number
}

export interface WardDTO {
  code: number
  name: string
  division_type?: string
  codename?: string
  district_code?: number
}