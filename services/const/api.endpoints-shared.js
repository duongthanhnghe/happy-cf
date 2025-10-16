export const API_ENDPOINTS_SHARED = {
  // ORDERS: {
  //   LIST_STATUS: '/orders/status',
  //   LIST_PAYMENTS: '/orders/payments',
  // },
  USERS: {
    LIST_MEMBERSHIP_LEVEL: '/auth/membership-level',
    GET_MEMBERSHIP_LEVEL_BY_ID: (id) => `/auth/membership-level/${id}`,
    LIST_MEMBERSHIP_BENEFIT: '/auth/membership-benefit',
    GET_MEMBERSHIP_BENEFIT_BY_ID: (id) => `/auth/membership-benefit/${id}`,
  },
  FILE_MANAGE: {
    UPLOAD: '/fileManage/images/upload',
    GET_IMAGES: (folder, limit) => `/fileManage/images?folder=${folder}&max_results=${limit}`,
    GET_FOLDERS: () => `/fileManage/images/folders`,
    DELETE_IMAGE: (id) => `/fileManage/images/delete?publicId=${id}`,
    SEARCH_IMAGE: () => `/fileManage/images/search`
  },
  LOCATION: {
    PROVINCES: '/location/provinces',
    PROVINCE_DETAIL: (provinceCode) => `/location/provinces/${provinceCode}`,
    DISTRICTS: (provinceCode) => `/location/districts/${provinceCode}`,
    DISTRICT_DETAIL: (districtCode) => `/location/district/${districtCode}`,
    WARDS: (districtCode) => `/location/wards/${districtCode}`,
    WARD_DETAIL: (wardCode,districtCode) => `/location/ward/${wardCode}?districtCode=${districtCode}`,
  }
}