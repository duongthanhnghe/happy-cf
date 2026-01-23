import { computed, unref, watch } from 'vue'
import type { Ref } from 'vue'
import type { TableOpt } from '@/server/types'
import type {
  PromotionGiftDTO,
  CreatePromotionGiftBody,
  PromotionGiftPaginationDTO,
} from '@/server/types/dto/v1/promotion-gift.dto'
import { promotionGiftAPI } from '@/services/v1/admin/promotion-gift.services'
import { showConfirm, showSuccess, showWarning } from '@/utils/toast'
import { Loading } from '@/utils/global'
import { useAdminProductCategoryTree } from '../product/category/useAdminProductCategoryTree'
import { findItemInTree, markAllSelectable } from '@/utils/treeHelpers'
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto'
import { useAdminProductDetailMap } from '@/composables/admin/product/useAdminProductDetailMap'
import { useDebounceFn } from '@/composables/utils/useDebounceFn'
import { useToggleActiveStatus } from '@/composables/utils/useToggleActiveStatus'

type MaybeRef<T> = T | Ref<T>

export const usePromotionGiftManageOperations = (
  defaultForm: CreatePromotionGiftBody,
  formItem: MaybeRef<CreatePromotionGiftBody>,
  updateItem: MaybeRef<CreatePromotionGiftBody>,
  dataList: Ref<PromotionGiftPaginationDTO|null>,
  serverItems: Ref<PromotionGiftDTO[]>,
  loadingTable: Ref<boolean>,
  totalItems: Ref<number>,
  currentTableOptions: Ref<TableOpt>,
  detailData: Ref<PromotionGiftDTO | null>,
  isTogglePopupAdd: Ref<boolean>,
  isTogglePopupUpdate: Ref<boolean>,
  selectedCategory: Ref<CategoryProductDTO[]>,
  selectedCategoryName: Ref<string[]>,
  search: Ref<string>,
  fromDay: Ref<string>,
  toDay: Ref<string>,
  itemsPerPage: number,
) => {

  const {
    fetchDetailProduct,
    getProductDetail,
    resetProductCache,
  } = useAdminProductDetailMap()

  const loadItems = async (opt: TableOpt) => {
    const from = fromDay.value !== '' ? new Date(fromDay.value).toISOString().slice(0, 10) : ''
    const to = toDay.value !== '' ? new Date(toDay.value).toISOString().slice(0, 10) : ''

    loadingTable.value = true
    try {
      const res = await promotionGiftAPI.getAll(
        opt.page,
        opt.itemsPerPage,
        {
          name: search.value || undefined,
          fromDate: from,
          toDate: to,
        }
      )

      if (res.code !== 0) return

      serverItems.value = res.data
      totalItems.value = res.pagination.total
    } finally {
      loadingTable.value = false
    }
  }

  watch(
    () => ({
      page: currentTableOptions.value.page,
      limit: currentTableOptions.value.itemsPerPage,
      fromDay: fromDay.value,
      toDay: toDay.value,
    }),
    () => {
      loadItems(currentTableOptions.value)
    },
    { deep: true }
  )

  const resetForm = () => {
    selectedCategory.value = []
    Object.assign(formItem, structuredClone(defaultForm))
    Object.assign(updateItem, structuredClone(defaultForm))
    resetProductCache()
  }

  const handleTogglePopupAdd = (val: boolean) => {
    resetForm()
    isTogglePopupAdd.value = val
  }

  const handleTogglePopupUpdate = (val: boolean) => {
    isTogglePopupUpdate.value = val
  }

  const submitCreate = async () => {
    Loading(true)
    try {
      const res = await promotionGiftAPI.create(unref(formItem))
      if (res.code === 0) {
        showSuccess(res.message || 'Tạo CTKM thành công')
        isTogglePopupAdd.value = false
        resetForm()
        loadItems(currentTableOptions.value)
      } else {
        showWarning(res.message || '')
      }
    } finally {
      Loading(false)
    }
  }

  const handleEdit = async (id: string) => {
    const res = await promotionGiftAPI.getDetail(id)
    if (res.code !== 0) return

    const data = res.data
    data.startDate = data.startDate.split('T')[0]
    data.endDate = data.endDate.split('T')[0]

    detailData.value = data
    Object.assign(updateItem, data)

    setSelectedCategory(unref(updateItem).requiredCategories)

    handleTogglePopupUpdate(true)
  }

  const submitUpdate = async () => {
    if (!detailData.value?.id) return

    Loading(true)
    try {
      const res = await promotionGiftAPI.update(
        detailData.value.id,
        unref(updateItem),
      )
      if (res.code === 0) {
        showSuccess(res.message || 'Cập nhật thành công')
        isTogglePopupUpdate.value = false
        resetForm()
        loadItems(currentTableOptions.value)
      } else {
        showWarning(res.message || '')
      }
    } finally {
      Loading(false)
    }
  }

  const { toggleActive } = useToggleActiveStatus(promotionGiftAPI.toggleActive, serverItems );

  const handleDelete = async (id: string) => {
    const ok = await showConfirm('Bạn có chắc muốn xoá CTKM tặng quà này?')
    if (!ok) return

    Loading(true)
    try {
      const res = await promotionGiftAPI.delete(id)
      if (res.code === 0) {
        showSuccess(res.message || 'Xoá thành công')
        loadItems(currentTableOptions.value)
      } else {
        showWarning(res.message || '')
      }
    } finally {
      Loading(false)
    }
  }

  const { getListCategoryAllTree, fetchCategoryListTree } =
      useAdminProductCategoryTree()

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
    const ids = val?.map(cat => cat.id) ?? []
    const names = val?.map(cat => cat.categoryName) ?? []

    if (isTogglePopupUpdate.value) {
      unref(updateItem).requiredCategories = ids
    } else {
      unref(formItem).requiredCategories = ids
    }

    selectedCategoryName.value = names
  })

  watch(getListCategoryAllTree, (newValue) => {
    if(newValue?.length === 0 && newValue) fetchCategoryListTree()
  }, { immediate: true})

  watch(
    () => unref(formItem).gifts.map(g => g.productId),
    (ids) => {
      ids.forEach(id => fetchDetailProduct(id))
    },
    { immediate: true }
  )

  watch(
    () => unref(updateItem).gifts.map(g => g.productId),
    (ids) => {
      ids.forEach(id => fetchDetailProduct(id))
    },
    { immediate: true }
  )

  const addGiftItem = () => {
    if (isTogglePopupUpdate.value) {
      unref(updateItem).gifts.push({
        productId: '',
        quantity: 1,
      })
    } else {
      unref(formItem).gifts.push({
        productId: '',
        quantity: 1,
      })
    }
  }

  const removeGiftItem = (index: number) => {
    if (isTogglePopupUpdate.value) {
      unref(updateItem).gifts.splice(index, 1)
    } else {
      unref(formItem).gifts.splice(index, 1)
    }
  }

  const resetFilter = () => {
    search.value = ''
    fromDay.value = ''
    toDay.value = ''
    currentTableOptions.value.page = 1
    currentTableOptions.value.itemsPerPage = itemsPerPage
  }

  const hasFilter = computed(() => {
    return (
      search.value !== '' ||
      fromDay.value !== '' ||
      toDay.value !== '' ||
      currentTableOptions.value.page !== 1 ||
      currentTableOptions.value.itemsPerPage !== itemsPerPage
    )
  })

  return {
    loadItems,
    handleTogglePopupAdd,
    handleTogglePopupUpdate,
    submitCreate,
    handleEdit,
    submitUpdate,
    handleDelete,
    treeItems,
    fetchDetailProduct,
    getProductDetail,
    resetFilter,
    hasFilter,
    addGiftItem,
    removeGiftItem,
    toggleActive,
  }
}
