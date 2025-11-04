export const API_ENDPOINTS_SHARED = {
  FILE_MANAGE: {
    UPLOAD: '/fileManage/images/upload',
    GET_IMAGES: (folder, limit) => `/fileManage/images?folder=${folder}&max_results=${limit}`,
    GET_FOLDERS: () => `/fileManage/images/folders`,
    DELETE_IMAGE: (id) => `/fileManage/images/delete?publicId=${id}`,
    SEARCH_IMAGE: () => `/fileManage/images/search`
  },
  LOCATION: {
    PROVINCES: '/location/provinces',
    PROVINCE_DETAIL: (provinceId) => `/location/provinces/${provinceId}`,
    DISTRICTS: (provinceId) => `/location/districts/${provinceId}`,
    DISTRICT_DETAIL: (districtId) => `/location/district/${districtId}`,
    WARDS: (districtId) => `/location/wards/${districtId}`,
    WARD_DETAIL: (wardId,districtId) => `/location/ward/${wardId}?districtId=${districtId}`,
  },
  BASE_INFORMATION: {
    GET: '/base-information',
    UPDATE: '/base-information',
  },
}