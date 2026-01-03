export const API_ENDPOINTS_SHARED = {
  FILE_MANAGE: {
    UPLOAD: '/fileManage/images/upload',
    GET_IMAGES: (folder: string, limit: number) => `/fileManage/images?folder=${folder}&max_results=${limit}`,
    GET_FOLDERS: () => `/fileManage/images/folders`,
    DELETE_IMAGE: (id: string) => `/fileManage/images/delete?publicId=${id}`,
    DELETE_IMAGES: '/fileManage/images',
    SEARCH_IMAGE: () => `/fileManage/images/search`
  },
  LOCATION: {
    PROVINCES: '/location/provinces',
    PROVINCE_DETAIL: (provinceId: number | string) => `/location/provinces/${provinceId}`,
    DISTRICTS: (provinceId: number | string) => `/location/districts/${provinceId}`,
    DISTRICT_DETAIL: (districtId: number | string) => `/location/district/${districtId}`,
    WARDS: (districtId: number) => `/location/wards/${districtId}`,
    WARD_DETAIL: (wardId: number | string,districtId: number | string) => `/location/ward/${wardId}?districtId=${districtId}`,
  },
  BASE_INFORMATION: {
    GET: '/base-information',
    UPDATE: '/base-information',
  },
}