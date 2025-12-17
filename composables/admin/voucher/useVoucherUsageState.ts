import { ref } from 'vue';
import type { TableHeaders, TableOpt } from '@/server/types';
import type { VoucherUsageDTO, VoucherUsagePaginationDTO } from '@/server/types/dto/v1/voucher-usage.dto';

export const useVoucherUsageState = () => {

  const dataList = ref<VoucherUsagePaginationDTO|null>(null);
  const itemsPerPage = 20;
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Mã voucher', key: 'code', sortable: false },
    { title: 'Loại voucher', key: 'type', sortable: false },
    { title: 'Giá trị giảm', key: 'discount', sortable: false },
    { title: 'Người dùng', key: 'userId', sortable: false },
    { title: 'Đơn hàng', key: 'orderId', sortable: false },
    // { title: 'Áp dụng cho sản phẩm', key: 'applicableProducts', sortable: false },
    { title: 'Cộng dồn', key: 'stackable', sortable: false },
    { title: 'Ngày dùng', key: 'usedAt', sortable: false },
    { title: 'Ngày tạo', key: 'createdAt', sortable: false },
    { title: 'Ngày cập nhật', key: 'updatedAt', sortable: false },
    {
      title: '',
      key: 'actions',
      sortable: false,
    },
    { title: 'Hoàn lại', key: 'reverted', sortable: false },
    // { title: 'Ngày hoàn lại', key: 'revertedAt', sortable: false },
  ]);
  const serverItems = ref<VoucherUsageDTO[]>([]);
  const loadingTable = ref<boolean>(true);
  const totalItems = ref<number>(0);
  const search = ref<string>('');
  const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage: itemsPerPage,
    sortBy: [],
  });
  const detailData = ref<VoucherUsageDTO | null>(null);
  const filterType = ref<string | null>(null)
  const fromDay = ref<string>('')
  const toDay = ref<string>('')

  return {
    dataList,
    serverItems,
    loadingTable,
    totalItems,
    search,
    headers,
    detailData,
    currentTableOptions,
    itemsPerPage,
    filterType,
    fromDay,
    toDay,
  };
};