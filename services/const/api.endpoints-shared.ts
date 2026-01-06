export const API_ENDPOINTS_SHARED = {
  LOCATION: {
    PROVINCES: '/location/provinces',
    PROVINCE_DETAIL: (provinceId: number | string) => `/location/provinces/${provinceId}`,
    DISTRICTS: (provinceId: number | string) => `/location/districts/${provinceId}`,
    DISTRICT_DETAIL: (districtId: number | string) => `/location/district/${districtId}`,
    WARDS: (districtId: number) => `/location/wards/${districtId}`,
    WARD_DETAIL: (wardId: number | string,districtId: number | string) => `/location/ward/${wardId}?districtId=${districtId}`,
  },
}