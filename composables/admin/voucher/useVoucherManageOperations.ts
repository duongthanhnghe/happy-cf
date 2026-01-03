import { computed, unref, watch } from 'vue';
import { useToggleActiveStatus } from '@/composables/utils/useToggleActiveStatus';
import { vouchersAPI } from '@/services/v1/admin/voucher.service';
import { showConfirm, showSuccess, showWarning } from '@/utils/toast';
import { Loading } from '@/utils/global';
import { useAdminProductCategoryTree } from '../product/category/useAdminProductCategoryTree';
import { findItemInTree, markAllSelectable } from '@/utils/treeHelpers';
import { VOUCHER_TYPE } from '@/server/shared/constants/voucher-type';
import type { Ref } from 'vue';
import type { TableOpt } from '@/server/types';
import type { CreateVoucherBody, VoucherDTO, VoucherPaginationDTO } from '@/server/types/dto/v1/voucher.dto';
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto';
type MaybeRef<T> = T | Ref<T>;

export const useVoucherManageOperations = (
  defaultForm: object,
  formItem: MaybeRef<CreateVoucherBody>,
  updateItem: MaybeRef<CreateVoucherBody>,
  dataList: Ref<VoucherPaginationDTO|null>,
  serverItems: Ref<VoucherDTO[]>,
  loadingTable: Ref<boolean>,
  totalItems: Ref<number>,
  search: Ref<string>,
  fromDay: Ref<string>,
  toDay: Ref<string>,
  currentTableOptions: Ref<TableOpt>,
  filterType: Ref<string | null>,
  itemsPerPage: number,
  detailData: Ref<VoucherDTO | null>,
  isTogglePopupAdd: Ref<boolean>,
  isTogglePopupUpdate: Ref<boolean>,
  checkEdit: Ref<boolean>,
  selectedCategory: Ref<CategoryProductDTO[]>,
  selectedCategoryName: Ref<string[]>,
) => {

  const { getListCategoryAllTree, fetchCategoryListTree } = useAdminProductCategoryTree()

  const getListData = async () => {
    const from = fromDay.value !== '' ? new Date(fromDay.value).toISOString().slice(0, 10) : ''
    const to = toDay.value !== '' ? new Date(toDay.value).toISOString().slice(0, 10) : ''

    const res = await vouchersAPI.getAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage, {
      code: search.value,
      type: filterType.value,
      fromDate: from,
      toDate: to,
      // reverted: false,
    });
    if (res.code !== 0) return

    dataList.value = res
    totalItems.value = res.pagination.total
    currentTableOptions.value.page = res.pagination.page
    currentTableOptions.value.itemsPerPage = res.pagination.limit
  };

  const ListAllVoucherApi = {
    async fetch({
      items,
    }: {
      items: VoucherDTO[],
    }) {

      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()

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
    })) as { items: VoucherDTO[] };

    serverItems.value = items;
    if(dataList.value?.data) totalItems.value = dataList.value.pagination.total
    loadingTable.value = false;

  }

  watch([search,filterType,fromDay, toDay], () => {
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
      const res = await vouchersAPI.create(unref(formItem));
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
      if(res.data.type === VOUCHER_TYPE.PRODUCT) setSelectedCategory(unref(updateItem).applicableCategories)
    }
  };

  async function submitUpdate() {
    if (!detailData.value) return;
    const id = detailData.value.id;
    if (!id) return;

    Loading(true);
    try {
      const res = await vouchersAPI.update(id, unref(updateItem));
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
    unref(formItem).value = 0,
    unref(formItem).maxDiscount = 0,
    unref(formItem).minOrderValue = 0,
    unref(formItem).maxShippingDiscount = 0,
    unref(formItem).applicableProducts = [],
    unref(formItem).applicableCategories = []
  }

  watch(() => unref(formItem).type, (val) => {
    if (val === VOUCHER_TYPE.FREESHIP) {
      unref(formItem).stackable = true
    } else {
      unref(formItem).stackable = false
    }

    resetFormType()
  })

  const resetFilter = () => {
    search.value = ''
    fromDay.value = ''
    toDay.value = ''
    filterType.value = null
    currentTableOptions.value.page = 1
    currentTableOptions.value.itemsPerPage = itemsPerPage
  }

  const hasFilter = computed(() => {
    return (
      search.value !== '' ||
      fromDay.value !== '' ||
      toDay.value !== '' ||
      filterType.value !== null ||
      currentTableOptions.value.page !== 1 ||
      currentTableOptions.value.itemsPerPage !== itemsPerPage
    )
  })

  const typeHasImage = computed(() => {
    const target = unref(updateItem).code ? unref(updateItem) : unref(formItem)
    return target.type === VOUCHER_TYPE.PRODUCT || target.type === VOUCHER_TYPE.PERCENTAGE || target.type === VOUCHER_TYPE.FIXED
  })

  const { toggleActive } = useToggleActiveStatus(vouchersAPI.toggleActive, serverItems);

  const treeItems = computed(() => {
    const items = getListCategoryAllTree.value ?? []
    return markAllSelectable(items)
  })

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
      unref(formItem).applicableCategories = val.map(cat => cat.id)

      selectedCategoryName.value = val.map(cat => cat.categoryName)
    } else {
      unref(formItem).applicableCategories = []
      selectedCategoryName.value = []
    }
  })

  watch(getListCategoryAllTree, (newValue) => {
    if(newValue?.length === 0 && newValue) fetchCategoryListTree()
  }, { immediate: true})

  return {
    hasFilter,
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
    treeItems,
    typeHasImage,
  };
};