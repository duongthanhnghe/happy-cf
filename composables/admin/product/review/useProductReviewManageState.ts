import { ref } from 'vue';
import type { TableHeaders, TableOpt } from '@/server/types';
import type { ProductReviewPaginationDTO, ProductReviewWithUserDTO } from '@/server/types/dto/v1/product-review.dto';

export const useProductReviewManageState = () => {

  const dataList = ref<ProductReviewPaginationDTO|null>(null)
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Người dùng', key: 'userId', sortable: false },
    { title: 'Nội dung đánh giá', key: 'comment', sortable: false },
    { title: 'Số sao', key: 'rating', sortable: false },
    { title: 'Thời gian tạo', key: 'createdAt', sortable: false },
    { title: 'Trạng thái đơn hàng', key: 'statusText', sortable: false },
    {
      title: '',
      key: 'actions',
      sortable: false,
      headerProps: { class: 'v-data-table-sticky-cl-right' },
      cellProps: { class: 'v-data-table-sticky-cl-right' }
    },
  ])
  const serverItems = ref<ProductReviewWithUserDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const totalItems = ref<number>(0)
  const search = ref<string>('')
  const searchInput = ref<string>('')
  const fromDay = ref<string>('')
  const toDay = ref<string>('')
  const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage: 20,
    sortBy: [],
  })
  const filterStatusOrder = ref<string|null>(null)
  const filterNumberStar = ref<string|null>(null)
  const isTogglePopupAdd = ref(false);

  return {
    dataList,
    isTogglePopupAdd,
    serverItems,
    loadingTable,
    totalItems,
    search,
    searchInput,
    fromDay,
    toDay,
    headers,
    currentTableOptions,
    filterStatusOrder,
    filterNumberStar,
  };
};
