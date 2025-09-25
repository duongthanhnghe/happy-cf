import type { ProductReviewPaginationDTO, ReviewStatus, ProductReviewWithUserDTO } from '@/server/types/dto/product-review.dto';
import type { TableOpt, TableHeaders, FilterTime } from '@/server/types/dto/table-vuetify.dto'
import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { Loading } from '@/utils/global'
import { showConfirm, showSuccess, showWarning } from "@/utils/toast";
import { useProductReviewAll } from "@/composables/product-review/useProductReviewAll";
import { productReviewAPI } from "@/services/productReview.service";

export const useProductReviewManageStore = defineStore("ProductReviewManageStore", () => {

  const { getListReview, fetchListReviewAll } = useProductReviewAll();

  const dataList = ref<ProductReviewPaginationDTO>()
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Nguoi dung', key: 'userId', sortable: false, },
    { title: 'Noi dung', key: 'comment', sortable: false, },
    { title: 'So sao', key: 'rating', sortable: false, },
    { title: 'Thoi gian', key: 'createdAt', sortable: false, },
    { title: 'Tinh trang don', key: 'statusText', sortable: false, },
    { title: '', key: 'actions', sortable: false, headerProps: { class: 'v-data-table-sticky-cl-right' },
      cellProps: { class: 'v-data-table-sticky-cl-right' }},
  ])
  const serverItems = ref<ProductReviewWithUserDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const totalItems = ref<number>(0)
  const name = ref<string>('')
  const search = ref<string>('')
  const fromDay = ref<string>('')
  const toDay = ref<string>('')
  const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage: 20,
    sortBy: [],
  })
  const filterStatusOrder = ref<string|null>(null)
  const filterNumberStar = ref<number|null>(null)
  const isTogglePopupAdd = ref(false);

const getListData = async () => {
  const data = await fetchListReviewAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage);

  if(data === undefined) return
  if(data.code !== 0) return
  dataList.value = data
  totalItems.value = data.pagination.total
  currentTableOptions.value.page = data.pagination.page
  currentTableOptions.value.itemsPerPage = data.pagination.limit
}

const filterByDate = (item: ProductReviewWithUserDTO, filterTime: FilterTime) => {
  const itemDate = new Date(item.createdAt)

  const from = filterTime.fromDay ? new Date(filterTime.fromDay) : null
  const to = filterTime.toDay ? new Date(filterTime.toDay) : null

  return (!from || itemDate >= from) && (!to || itemDate <= to)
}

const ListAllProductApi = {
  async fetch({
    items,
    page,
    itemsPerPage,
    sortBy,
    search,
    filterStatusOrder,
    filterNumberStar,
    filterTime
  }: {
    items: ProductReviewWithUserDTO[],
    page: number,
    itemsPerPage: number,
    sortBy: TableOpt["sortBy"],
    search: { fullname: string},
    filterStatusOrder?: string,
    filterNumberStar?: number,
    filterTime?: FilterTime
  }) {
    return new Promise(resolve => {
      setTimeout(() => {
        let filtered = items.slice()

        if (search.fullname) {
          filtered = filtered.filter(item =>
            typeof item.userId !== "string" &&
            item.userId.fullname.toLowerCase().includes(search.fullname.toLowerCase())
          )
        }

        if (filterStatusOrder) {
          filtered = filtered.filter(item => item.status === filterStatusOrder)
        }

        if (filterNumberStar) {
          filtered = filtered.filter(item => item.rating === filterNumberStar)
        }

        if (filterTime) {
          filtered = filtered.filter(item => filterByDate(item, filterTime))
        }

        resolve({ items: filtered })
      }, 300)
    })
  }
}
  
async function loadItems(opt:TableOpt) {
  loadingTable.value = true;

  await getListData();
  if(!dataList.value?.data) return

  const { items } = (await ListAllProductApi.fetch({
    items: dataList.value?.data,
    page: opt.page,
    itemsPerPage: opt.itemsPerPage,
    sortBy: opt.sortBy,
    search: {
      fullname: name.value,
    },
    filterTime: { fromDay: fromDay.value, toDay: toDay.value },
    filterStatusOrder: filterStatusOrder.value || '',
    filterNumberStar: filterNumberStar.value || 0,
  })) as { items: ProductReviewWithUserDTO[] }

  serverItems.value = items;
  if(dataList.value?.data) totalItems.value = dataList.value.pagination.total
  loadingTable.value = false;
}

  watch([name, fromDay, toDay, filterStatusOrder, filterNumberStar], () => {
    loadItems(currentTableOptions.value);
  });

  watch(() => [currentTableOptions.value.page,currentTableOptions.value.itemsPerPage], () => {
    loadItems(currentTableOptions.value);
  })

  // actions global
  const handleTogglePopupAdd = (value: boolean) => {
    isTogglePopupAdd.value = value;
  };

  const handleReload = async () => {
    await loadItems(currentTableOptions.value);
  }

  //actions delete
  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm('Bạn có chắc xoá?')
    if (!confirmed) return
  
    Loading(true);
    try {
      const data = await productReviewAPI.delete(id)
      if(data.code === 0) {
        showSuccess(data.message ?? '')
        if(dataList.value?.data){
          dataList.value.data = dataList.value?.data?.filter(item => 
            item.id !== id
          )
        }
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  const handleUpdateStatusOrder = async (id:string, status:ReviewStatus) => {
    console.log(status)
    Loading(true);
    try {
      const data = await productReviewAPI.updateStatus(id, status)
      if(data.code === 0) {
        showSuccess(data.message ?? '')
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  const resetFilter = () => {
    name.value = ''
    fromDay.value = ''
    toDay.value = ''
    filterStatusOrder.value = null
    filterNumberStar.value = null
    currentTableOptions.value.page = 1
    currentTableOptions.value.itemsPerPage = 20
  }

  const hasFilter = computed(() => {
    return (
      name.value !== '' ||
      fromDay.value !== '' ||
      toDay.value !== '' ||
      filterStatusOrder.value !== null ||
      filterNumberStar.value !== null ||
      currentTableOptions.value.page !== 1 ||
      currentTableOptions.value.itemsPerPage !== 20
    )
  })


  //getters
  
  return {
    // state
    dataList,
    isTogglePopupAdd,
    serverItems,
    loadingTable,
    totalItems,
    name,
    search,
    fromDay,
    toDay,
    headers,
    currentTableOptions,
    filterStatusOrder,
    filterNumberStar,
    hasFilter,
    // actions
    handleTogglePopupAdd,
    getListData,
    loadItems,
    handleReload,
    handleDelete,
    handleUpdateStatusOrder,
    resetFilter,
  };
});