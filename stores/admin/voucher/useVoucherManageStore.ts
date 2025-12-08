import { ref, reactive, watch, computed } from "vue";
import { defineStore } from "pinia";
import { vouchersAPI } from "@/services/v1/admin/voucher.service";
import { nullRules, nullAndSpecialRules } from '@/utils/validation';
import { Loading } from '@/utils/global';
import type { TableOpt, TableHeaders, FilterTime } from '@/server/types/dto/v1/table-vuetify.dto';
import type { VoucherDTO, CreateVoucherBody, VoucherPaginationDTO } from '@/server/types/dto/v1/voucher.dto';
import { showConfirm, showSuccess, showWarning } from "@/utils/toast";
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
import { VOUCHER_TYPE } from '@/server/shared/constants/voucher-type';
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto'
import { findItemInTree, markAllSelectable } from '@/utils/treeHelpers'
import { useAdminProductCategoryTree } from '@/composables/product/useAdminProductCategoryTree'
import { useVoucherUtils } from "@/composables/voucher/useVoucherUtils";
import { useFileManageFolderStore } from "../file-manage/useFileManageStore";

export const useVoucherManageStore = defineStore("VoucherManage", () => {

  const { getListCategoryAllTree, fetchCategoryListTree } = useAdminProductCategoryTree()
  const { isDiscountVoucherType } = useVoucherUtils()
  const storeFileManage = useFileManageFolderStore();

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

  const dataList = ref<VoucherPaginationDTO>();
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
  const code = ref<string>('');
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
  const treeItems = computed(() => {
    const items = getListCategoryAllTree.value ?? []
    return markAllSelectable(items)
  })
  const fromDay = ref<string>('')
  const toDay = ref<string>('')

  const getListData = async () => {
    const res = await vouchersAPI.getAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage);
    if (res.code !== 0) return

    dataList.value = res
    totalItems.value = res.pagination.total
    currentTableOptions.value.page = res.pagination.page
    currentTableOptions.value.itemsPerPage = res.pagination.limit
  };

  const filterByDate = (item: VoucherDTO, filterTime: FilterTime) => {
    const voucherStart = item.startDate ? new Date(item.startDate) : null
    const voucherEnd = item.endDate ? new Date(item.endDate) : null

    const from = filterTime.fromDay ? new Date(filterTime.fromDay) : null
    const to = filterTime.toDay ? new Date(filterTime.toDay) : null

    // Nếu không có startDate/endDate thì bỏ qua lọc
    if (!voucherStart && !voucherEnd) return true

    // Trường hợp có cả start & end
    if (voucherStart && voucherEnd) {
      return (!from || voucherEnd >= from) && (!to || voucherStart <= to)
    }

    // Chỉ có startDate
    if (voucherStart && !voucherEnd) {
      return (!from || voucherStart >= from) && (!to || voucherStart <= to)
    }

    // Chỉ có endDate
    if (!voucherStart && voucherEnd) {
      return (!from || voucherEnd >= from) && (!to || voucherEnd <= to)
    }

    return true
  }

  const ListAllVoucherApi = {
    async fetch({
      items,
      page, itemsPerPage, sortBy,
      search,
      filterType,
      filterTime,
    }: {
      items: VoucherDTO[],
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
    })) as { items: VoucherDTO[] };

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

  const handleTogglePopupAdd = (value: boolean) => {
    handleResetForm();
    if (detailData.value) detailData.value.id = '';
    isTogglePopupAdd.value = value;
  };

  const handleTogglePopupUpdate = (value: boolean) => {
    isTogglePopupUpdate.value = value;
  };

  const handleResetForm = () => {
    Object.assign(formItem, defaultForm);
    Object.assign(updateItem, defaultForm);
  };

  const handleReload = async () => {
    await loadItems(currentTableOptions.value);
  };

  async function submitCreate() {
    Loading(true);
    try {
      const res = await vouchersAPI.create({ ...formItem });
      if (res.code === 0) {
        showSuccess(res.message ?? '');
        isTogglePopupAdd.value = false;
        handleResetForm();
        handleReload();
      } else showWarning(res.message ?? '');
    } catch (err) {
      console.error(err);
    } finally {
      Loading(false);
    }
  }

  const handleEdit = async (id: string) => {
    if (!id) return;
    checkEdit.value = true;
    const res = await vouchersAPI.getDetail(id);
    if (res.code === 0) {

      if (res.data.startDate) {
        res.data.startDate = new Date(res.data.startDate).toISOString().split('T')[0];
      }
      if (res.data.endDate) {
        res.data.endDate = new Date(res.data.endDate).toISOString().split('T')[0];
      }

      // check voucher co duoc sua khong?
      const now = new Date();
      const start = new Date(res.data.startDate);
      const end = new Date(res.data.endDate);

      if ((now >= start && now <= end) || end < now || res.data.usedCount > 0 ) {
        checkEdit.value = false;
      }

      detailData.value = res.data;
      handleTogglePopupUpdate(true);
      Object.assign(updateItem, detailData.value);

      if(res.data.type === 'product') setSelectedCategory(updateItem.applicableCategories)

    }
  };

  async function submitUpdate() {
    if (!detailData.value) return;
    const id = detailData.value.id;
    if (!id) return;

    Loading(true);
    try {
      const res = await vouchersAPI.update(id, { ...updateItem });
      if (res.code === 0) {
        showSuccess(res.message ?? '');
        isTogglePopupUpdate.value = false;
        handleResetForm();
        handleReload();
      } else showWarning(res.message ?? '');
    } catch (err) {
      console.error(err);
    } finally {
      Loading(false);
    }
  }

  const handleDelete = async (id: string) => {
    const confirm = await showConfirm('Bạn có chắc xoá voucher này?');
    if (!confirm) return;
    Loading(true);
    try {
      const res = await vouchersAPI.delete(id);
      if (res.code === 0) {
        showSuccess(res.message ?? '');
        if (dataList.value)
          dataList.value.data = dataList.value?.data.filter(item => item.id !== id);
          handleReload();
      } else showWarning(res.message ?? '');
    } catch (err) {
      console.error(err);
    } finally {
      Loading(false);
    }
  };

  const resetFormType = () => {
    formItem.value = 0,
    formItem.maxDiscount = 0,
    formItem.minOrderValue = 0,
    formItem.maxShippingDiscount = 0,
    formItem.applicableProducts = [],
    formItem.applicableCategories = []
  }

  watch(() => formItem.type, (val) => {
    if (val === VOUCHER_TYPE.FREESHIP) {
      formItem.stackable = true
    } else {
      formItem.stackable = false
    }

    resetFormType()
  })

  // Tree category
  const setSelectedCategory = (categoryIds: string[] = []) => {
    if (categoryIds && categoryIds.length > 0) {
      const sourceTree = treeItems.value ?? []
      const selected: CategoryProductDTO[] = []

      categoryIds.forEach(id => {
        const found = findItemInTree(sourceTree, id)
        if (found) selected.push(found)
      })

      selectedCategory.value = selected
      selectedCategoryName.value = selected.map(cat => cat.categoryName)
    } else {
      selectedCategory.value = []
      selectedCategoryName.value = []
    }
  }

  watch(selectedCategory, (val) => {
    if (val && val.length > 0) {
      formItem.applicableCategories = val.map(cat => cat.id)

      selectedCategoryName.value = val.map(cat => cat.categoryName)
    } else {
      formItem.applicableCategories = []
      selectedCategoryName.value = []
    }
  })

  watch(getListCategoryAllTree, (newValue) => {
    if(newValue?.length === 0 && newValue) fetchCategoryListTree()
  }, { immediate: true})

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

  const { toggleActive } = useToggleActiveStatus(vouchersAPI.toggleActive, serverItems);

  //upload image
  const handleAddImage = () => {
    storeFileManage.handleTogglePopup(true);
  }

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return

    const target = detailData.value?.id ? updateItem : formItem

    target.image = newValue.url
  })

  return {
    dataList,
    serverItems,
    loadingTable,
    totalItems,
    code,
    search,
    headers,
    formItem,
    updateItem,
    detailData,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    nullRules,
    nullAndSpecialRules,
    currentTableOptions,
    itemsPerPage,
    selectedCategoryName,
    selectedCategory,
    checkEdit,
    filterType,
    hasFilter,
    toDay,
    fromDay,
    // Actions
    loadItems,
    handleTogglePopupAdd,
    handleTogglePopupUpdate,
    handleResetForm,
    handleReload,
    submitCreate,
    handleEdit,
    submitUpdate,
    handleDelete,
    toggleActive,
    resetFilter,
    isDiscountVoucherType,
    treeItems,
    handleAddImage,
  };
});
