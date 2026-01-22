import { reactive, ref } from 'vue'
import type { TableHeaders, TableOpt } from '@/server/types'
import type {
  PromotionGiftDTO,
  CreatePromotionGiftBody,
  PromotionGiftPaginationDTO,
} from '@/server/types/dto/v1/promotion-gift.dto'
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto'

export const usePromotionGiftManageState = () => {
  const defaultForm: CreatePromotionGiftBody = {
    name: '',
    description: '',
    isActive: true,

    minOrderValue: 0,
    requiredProducts: [],
    requiredCategories: [],

    startDate: '',
    endDate: '',

    gifts: [
      {
        productId: '',
        quantity: 1,
      },
    ],

    usageLimit: 0,
    stackable: false,
  }

  const formItem = reactive<CreatePromotionGiftBody>({ ...defaultForm })
  const updateItem = reactive<CreatePromotionGiftBody>({ ...defaultForm })

  const dataList = ref<PromotionGiftPaginationDTO|null>(null)
  const serverItems = ref<PromotionGiftDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const totalItems = ref<number>(0)

  const itemsPerPage = 20
  const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage,
    sortBy: [],
  })

  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Tên CTKM', key: 'name', sortable: false },
    { title: 'Đơn tối thiểu', key: 'minOrderValue', sortable: false },
    { title: 'Quà tặng', key: 'gifts', sortable: false },
    { title: 'Đã dùng', key: 'usedCount', sortable: false },
    { title: 'Giới hạn', key: 'usageLimit', sortable: false },
    { title: 'Cộng dồn', key: 'stackable', sortable: false },
    { title: 'Trạng thái', key: 'isActive', sortable: false },
    { title: 'Thời gian', key: 'dateRange', sortable: false },
    {
      title: '',
      key: 'actions',
      sortable: false,
      headerProps: { class: 'v-data-table-sticky-cl-right' },
      cellProps: { class: 'v-data-table-sticky-cl-right' },
    },
  ])

  const isTogglePopupAdd = ref<boolean>(false)
  const isTogglePopupUpdate = ref<boolean>(false)
  const detailData = ref<PromotionGiftDTO | null>(null)

  const selectedCategory = ref<CategoryProductDTO[]>([])
  const selectedCategoryName = ref<string[]>([])

  const search = ref<string>('');
  const fromDay = ref<string>('')
  const toDay = ref<string>('')

  return {
    defaultForm,
    formItem,
    updateItem,
    dataList,
    serverItems,
    loadingTable,
    totalItems,
    headers,
    currentTableOptions,
    itemsPerPage,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    detailData,
    selectedCategory,
    selectedCategoryName,
    search,
    fromDay,
    toDay,
  }
}
