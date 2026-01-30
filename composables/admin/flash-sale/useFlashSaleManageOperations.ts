import { computed, unref, watch } from "vue";
import type { Ref } from "vue";
import type { TableOpt } from "@/server/types";
import { flashSalesAPI } from "@/services/v1/admin/flash-sale.service";
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
import { useTableUtils } from "@/composables/utils/useTableSearch";
import { Loading, toDatetimeLocal } from "@/utils/global";
import { showConfirm, showSuccess, showWarning } from "@/utils/toast";
import type {
  FlashSaleDTO,
  FlashSalePaginationDTO,
  CreateFlashSaleBody,
  UpdateFlashSaleBody,
  FlashSaleItemDTO,
} from "@/server/types/dto/v1/flash-sale.dto";
import { useAdminProductDetailMap } from "../product/useAdminProductDetailMap";

type MaybeRef<T> = T | Ref<T>;

export const useFlashSaleManageOperations = (
  defaultForm: CreateFlashSaleBody,

  formItem: MaybeRef<CreateFlashSaleBody>,
  updateItem: MaybeRef<UpdateFlashSaleBody>,

  dataList: Ref<FlashSalePaginationDTO | null>,
  serverItems: Ref<FlashSaleDTO[]>,

  loadingTable: Ref<boolean>,
  totalItems: Ref<number>,

  search: Ref<string>,
  searchInput: Ref<string>,
  fromDay: Ref<string>,
  toDay: Ref<string>,

  currentTableOptions: Ref<TableOpt>,
  itemsPerPage: number,

  detailData: Ref<FlashSaleDTO | null>,
  isTogglePopupAdd: Ref<boolean>,
  isTogglePopupUpdate: Ref<boolean>
) => {

  const {
    fetchDetailProduct,
    getProductDetail,
    resetProductCache,
    productMap,
  } = useAdminProductDetailMap()

  const getListData = async () => {
    const res = await flashSalesAPI.getAll(
      currentTableOptions.value.page,
      currentTableOptions.value.itemsPerPage,
      {
        name: search.value,
        fromDate: fromDay.value,
        toDate: toDay.value,
      }
    );

    if (res.code !== 0) return;

    dataList.value = res;
    serverItems.value = res.data;
    totalItems.value = res.pagination.total;
  };

  async function loadItems(opt: TableOpt) {
    loadingTable.value = true;
    await getListData();
    loadingTable.value = false;
  }

  watch(
    () => [currentTableOptions.value.page, currentTableOptions.value.itemsPerPage],
    () => loadItems(currentTableOptions.value)
  );

  const handleTogglePopupAdd = (v: boolean) => {
    Object.assign(formItem, structuredClone(defaultForm))
    resetProductCache()
    isTogglePopupAdd.value = v
  }

  const handleTogglePopupUpdate = (v: boolean) => {
    isTogglePopupUpdate.value = v;
  };

  const resetForm = () => {
    Object.assign(formItem, structuredClone(defaultForm))

    Object.assign(updateItem, {
      items: [],
      startDate: "",
      endDate: "",
    })

    resetProductCache()
  }

  const handleEdit = async (id: string) => {
    const res = await flashSalesAPI.getDetail(id);
    if (res.code !== 0) return;

    detailData.value = res.data;

    Object.assign(updateItem, {
      ...res.data,
      startDate: res.data.startDate
        ? toDatetimeLocal(res.data.startDate)
        : '',
      endDate: res.data.endDate
        ? toDatetimeLocal(res.data.endDate)
        : '',
      items: res.data.items.map(i => ({
        productId: i.productId,
        variantSku: i.variantSku,
        originalPrice: i.originalPrice,
        salePrice: i.salePrice,
        quantity: i.quantity,
        sold: i.sold,
        __isNew: false,
      })),
    })

    res.data.items.forEach(item => {
      if (typeof item.productId === 'string' && item.productId) {
        fetchDetailProduct(item.productId)
      }
    })

    isTogglePopupUpdate.value = true;
  };

  const submitCreate = async () => {
    Loading(true);
    const res = await flashSalesAPI.create(unref(formItem));
    Loading(false);

    if (res.code === 0) {
      showSuccess(res.message ?? "Tạo flash sale thành công");
      isTogglePopupAdd.value = false;
      resetForm()
      loadItems(currentTableOptions.value);
    } else {
      showWarning(res.message ?? "Tạo flash sale thất bại");
    }
  };

  const submitUpdate = async () => {
    if (!detailData.value) return;

    Loading(true);
    const res = await flashSalesAPI.update(
      detailData.value.id,
      unref(updateItem)
    );
    Loading(false);

    if (res.code === 0) {
      showSuccess(res.message ?? "Cập nhật flash sale thành công");
      isTogglePopupUpdate.value = false;
      resetForm()
      loadItems(currentTableOptions.value);
    } else {
      showWarning(res.message ?? "Cập nhật thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    if (!(await showConfirm("Bạn có chắc muốn xoá flash sale này?"))) return;

    const res = await flashSalesAPI.delete(id);
    if (res.code === 0) {
      showSuccess(res.message ?? "Đã xoá flash sale");
      loadItems(currentTableOptions.value);
    }
  };

  const addItem = () => {
    const target = isTogglePopupUpdate.value ? updateItem : formItem;
    unref(target).items?.push({
      productId: "",
      variantSku: null,
      originalPrice: 0,
      salePrice: 0,
      quantity: 1,
      __isNew: true, //check
    });
  };

  const removeItem = (index: number) => {
    const target = isTogglePopupUpdate.value ? updateItem : formItem;
    unref(target).items?.splice(index, 1);
  };

  const getMaxStock = (item: any) => {
    const product = getProductDetail(item.productId)
    if (!product) return 0

    if (!product.variantCombinations.length) {
      return product.amount ?? 0
    }

    const variant = product.variantCombinations.find(
      v => v.sku === item.variantSku
    )

    return variant?.stock ?? 0
  }

  const syncItems = (items: FlashSaleItemDTO[]) => {
    items.forEach(item => {
      if(typeof item.productId !== 'string') return

      const product = getProductDetail(item.productId)

      if (!product) return

      // KHÔNG VARIANT
      if (!product.variantCombinations?.length) {
        item.variantSku = null
        item.originalPrice = product.price

        if (!item.quantity || item.quantity > (product.amount ?? 0)) {
          item.quantity = product.amount ?? 0
        }

        if (!item.salePrice || item.salePrice >= item.originalPrice) {
          item.salePrice = item.originalPrice
        }

        return
      }

      // CÓ VARIANT
      if (!item.variantSku) return

      const variant = product.variantCombinations.find(
        v => v.sku === item.variantSku
      )
      if (!variant) return

      item.originalPrice =
        variant.priceModifier && variant.priceModifier > 0
          ? variant.priceModifier
          : product.price

      if (!item.quantity || item.quantity > (variant.stock ?? 0)) {
        item.quantity = variant.stock ?? 0
      }

      if (!item.salePrice || item.salePrice >= item.originalPrice) {
        item.salePrice = item.originalPrice
      }
    })
  }

  const activeForm = computed(() => {
    return (isTogglePopupAdd.value
      ? unref(formItem)
      : unref(updateItem)) as {
        items?: FlashSaleItemDTO[]
      }
  })

  watch(
    () => activeForm.value.items?.map(i => i.productId) ?? [],
    async (ids) => {
      await Promise.all(
        ids.filter(Boolean).map(id => fetchDetailProduct(id as string))
      )
    },
    { immediate: true }
  )

  watch(
    () => ({
      items: activeForm.value.items?.map(i => ({
        productId: i.productId,
        variantSku: i.variantSku,
      })) ?? [],
      productMap: productMap.value,
    }),
    () => {
      if (!activeForm.value.items) return
      syncItems(activeForm.value.items)
    },
    { deep: true, immediate: true }
  )

  const { handleSearch } = useTableUtils(search, searchInput);

  const resetFilter = () => {
    search.value = "";
    searchInput.value = "";
    fromDay.value = "";
    toDay.value = "";
    currentTableOptions.value.page = 1;
    currentTableOptions.value.itemsPerPage = itemsPerPage;
  };

  const hasFilter = computed(
    () =>
      search.value ||
      fromDay.value ||
      toDay.value ||
      currentTableOptions.value.page !== 1 ||
      currentTableOptions.value.itemsPerPage !== itemsPerPage
  );

  const { toggleActive } = useToggleActiveStatus(
    flashSalesAPI.toggleActive,
    serverItems
  );

  const now = computed(() => Date.now())

  const isStarted = computed(() => {
    if (!detailData.value?.startDate) return false
    return new Date(detailData.value.startDate).getTime() <= now.value
  })

  const isEnded = computed(() => {
    if (!detailData.value?.endDate) return false
    return new Date(detailData.value.endDate).getTime() < now.value
  })

  const isRunningOrEnded = computed(() => isStarted.value)

  const canEditTimeAndStackable = computed(() => {
    return !isRunningOrEnded.value
  })

  const canEditOldItem = (item: { __isNew?: boolean }) => {
    if (item.__isNew) return true
    return !isRunningOrEnded.value
  }

  const getAvailableVariants = (currentItem: FlashSaleItemDTO) => {
    if(typeof currentItem.productId !== 'string') return

    const product = getProductDetail(currentItem.productId)
    if (!product?.variantCombinations?.length) return []

    const items =
      isTogglePopupAdd.value
        ? unref(formItem).items
        : unref(updateItem).items

    return product.variantCombinations.filter(variant => {
      if (variant.stock === 0) return false
      if ('inStock' in variant && variant.inStock === false) return false

      const isUsedByOtherItem = items?.some(item =>
        item !== currentItem &&
        item.productId === currentItem.productId &&
        item.variantSku === variant.sku
      )

      return !isUsedByOtherItem
    })
  }

  const remainingProductNames = (items: any[]) => {
    if (!items) return "";

    return items
      .slice(2)
      .map(item => `${item.productId.productName}-${(item.variantSku ?? '')}, `)
      .join("");
  }

  return {
    loadItems,
    hasFilter,
    resetFilter,
    handleSearch,
    handleTogglePopupAdd,
    handleTogglePopupUpdate,
    handleEdit,
    submitCreate,
    submitUpdate,
    handleDelete,
    toggleActive,
    addItem,
    removeItem,
    getProductDetail,
    fetchDetailProduct,
    getMaxStock,
    isStarted,
    isEnded,
    isRunningOrEnded,
    canEditTimeAndStackable,
    canEditOldItem,
    getAvailableVariants,
    remainingProductNames,
  };
};