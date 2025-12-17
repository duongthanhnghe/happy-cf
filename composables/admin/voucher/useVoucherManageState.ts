import { reactive, ref } from 'vue';
import type { TableHeaders, TableOpt } from '@/server/types';
import type { CreateVoucherBody, VoucherDTO, VoucherPaginationDTO } from '@/server/types/dto/v1/voucher.dto';
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto';
import { VOUCHER_TYPE } from '@/server/shared/constants/voucher-type';

export const useVoucherManageState = () => {

  const defaultForm: CreateVoucherBody = {
    code: '',
    name: '',
    image: '',
    type: VOUCHER_TYPE.PERCENTAGE,
    value: 0,
    maxDiscount: 0,
    minOrderValue: 0,
    maxShippingDiscount: 0,
    usageLimit: 0,
    limitPerUser: 0,
    startDate: '',
    endDate: '',
    applicableProducts: [],
    applicableCategories: [],
    stackable: false,
    isActive: false,
    description: ''
  };

  const formItem = reactive<CreateVoucherBody>({ ...defaultForm });
  const updateItem = reactive<CreateVoucherBody>({ ...defaultForm });

  const dataList = ref<VoucherPaginationDTO|null>(null);
  const itemsPerPage = 20;
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Mã voucher', key: 'code', sortable: false },
    { title: 'Tên voucher', key: 'name', sortable: false },
    { title: 'Loại', key: 'type', sortable: false },
    { title: 'Số lượng', key: 'usageLimit', sortable: false },
    { title: 'Đã dùng', key: 'usedCount', sortable: false },
    { title: 'Giới hạn user', key: 'limitPerUser', sortable: false },
    { title: 'Thời gian', key: 'dateRange', sortable: false, headerProps: { class: 'white-space' },
    cellProps: { class: 'white-space' }},
    { title: 'Trạng thái', key: 'isActive', sortable: false },
    { title: 'Giá trị giảm', key: 'value', sortable: false },
    { title: 'Giảm tối đa', key: 'maxDiscount', sortable: false },
    { title: 'Đơn hàng tối thiểu', key: 'minOrderValue', sortable: false },
    { title: 'Giảm phí vận chuyển', key: 'maxShippingDiscount', sortable: false },
    { title: 'Ngày tạo', key: 'createdAt', sortable: false },
    { title: '', key: 'actions', sortable: false, headerProps: { class: 'v-data-table-sticky-cl-right' },
    cellProps: { class: 'v-data-table-sticky-cl-right' } }
  ]);
  const serverItems = ref<VoucherDTO[]>([]);
  const loadingTable = ref<boolean>(true);
  const totalItems = ref<number>(0);
  const search = ref<string>('');
  const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage: itemsPerPage,
    sortBy: [],
  });
  const isTogglePopupAdd = ref<boolean>(false);
  const isTogglePopupUpdate = ref<boolean>(false);
  const detailData = ref<VoucherDTO | null>(null);
  const filterType = ref<string | null>(null)
  const checkEdit = ref<boolean>(true);
  const selectedCategory = ref<CategoryProductDTO[]>([])
  const selectedCategoryName = ref<string[]>([])
  
  const fromDay = ref<string>('')
  const toDay = ref<string>('')

  return {
    defaultForm,
    dataList,
    serverItems,
    loadingTable,
    totalItems,
    search,
    headers,
    formItem,
    updateItem,
    detailData,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    currentTableOptions,
    itemsPerPage,
    selectedCategoryName,
    selectedCategory,
    checkEdit,
    filterType,
    toDay,
    fromDay,
  };
};