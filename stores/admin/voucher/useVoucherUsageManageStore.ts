import { ref, reactive, watch, computed } from "vue";
import { defineStore } from "pinia";
import { vouchersUsageAPI } from "@/services/v1/admin/voucher-usage.service";
import { Loading } from '@/utils/global';
import type { TableOpt, TableHeaders, FilterTime } from '@/server/types/dto/v1/table-vuetify.dto';
import type { VoucherUsageDTO, VoucherUsagePaginationDTO } from "@/server/types/dto/v1/voucher-usage.dto";

export const useVoucherUsageManageStore = defineStore("VoucherUsageManage", () => {

  const dataList = ref<VoucherUsagePaginationDTO>();
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
    { title: 'Hoàn lại', key: 'reverted', sortable: false },
    // { title: 'Ngày hoàn lại', key: 'revertedAt', sortable: false },
    { title: 'Ngày tạo', key: 'createdAt', sortable: false },
    { title: 'Ngày cập nhật', key: 'updatedAt', sortable: false },
    {
      title: '',
      key: 'actions',
      sortable: false,
      headerProps: { class: 'v-data-table-sticky-cl-right' },
      cellProps: { class: 'v-data-table-sticky-cl-right' },
    },
  ]);
  const serverItems = ref<VoucherUsageDTO[]>([]);
  const loadingTable = ref<boolean>(true);
  const totalItems = ref<number>(0);
  const code = ref<string>('');
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

  const getListData = async () => {
    const res = await vouchersUsageAPI.getAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage);
    if (res.code !== 0) return

    dataList.value = res
    totalItems.value = res.pagination.total
    currentTableOptions.value.page = res.pagination.page
    currentTableOptions.value.itemsPerPage = res.pagination.limit
  };

  const filterByDate = (item: VoucherUsageDTO, filterTime: FilterTime) => {
    const itemDate = new Date(item.usedAt)
  
    const from = filterTime.fromDay ? new Date(filterTime.fromDay) : null
    const to = filterTime.toDay ? new Date(filterTime.toDay) : null
  
    return (!from || itemDate >= from) && (!to || itemDate <= to)
  }

  const ListAllVoucherApi = {
    async fetch({
      items,
      page, itemsPerPage, sortBy,
      search,
      filterType,
      filterTime
    }: {
      items: VoucherUsageDTO[],
      page: TableOpt["page"],
      itemsPerPage: TableOpt["itemsPerPage"],
      sortBy: TableOpt["sortBy"],
      search: { code: string },
      filterType?: string,
      filterTime?: FilterTime
    }) {

      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()

          if (search.code) {
            filtered = filtered.filter(item =>
              item.code.toLowerCase().includes(search.code.toLowerCase())
            )
          }

          if (filterType) {
            filtered = filtered.filter(item => item.type === filterType)
          }

          if (filterTime) {
            filtered = filtered.filter(item => filterByDate(item, filterTime))
          }

          resolve({ items: filtered })
        }, 300)
      })
    },
  };

  async function loadItems(opt: TableOpt) {
    loadingTable.value = true;
    await getListData();

    const { items } = (await ListAllVoucherApi.fetch({
      items: dataList.value?.data || [],
      page: opt.page,
      itemsPerPage: opt.itemsPerPage,
      sortBy: opt.sortBy,
      search: { code: code.value },
      filterType: filterType.value || '',
      filterTime: { fromDay: fromDay.value, toDay: toDay.value },
    })) as { items: VoucherUsageDTO[] };

    serverItems.value = items;
    if(dataList.value?.data) totalItems.value = dataList.value.pagination.total
    loadingTable.value = false;

  }

  watch([code,filterType,fromDay, toDay], () => {
    loadItems(currentTableOptions.value);
  });

  watch(() => [currentTableOptions.value.page,currentTableOptions.value.itemsPerPage], () => {
    loadItems(currentTableOptions.value);
  })

  const resetFilter = () => {
    code.value = ''
    fromDay.value = ''
    toDay.value = ''
    filterType.value = null
    currentTableOptions.value.page = 1
    currentTableOptions.value.itemsPerPage = itemsPerPage
  }

  const hasFilter = computed(() => {
    return (
      code.value !== '' ||
      fromDay.value !== '' ||
      toDay.value !== '' ||
      filterType.value !== null ||
      currentTableOptions.value.page !== 1 ||
      currentTableOptions.value.itemsPerPage !== itemsPerPage
    )
  })

  const handleReload = async () => {
    await loadItems(currentTableOptions.value);
  };

  return {
    dataList,
    serverItems,
    loadingTable,
    totalItems,
    code,
    search,
    headers,
    detailData,
    currentTableOptions,
    itemsPerPage,
    filterType,
    fromDay,
    toDay,
    hasFilter,
    // Actions
    loadItems,
    handleReload,
    resetFilter
  };
});
