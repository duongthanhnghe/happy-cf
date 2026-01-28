import { showWarning, showConfirm, showSuccess } from "@/utils/toast";
import { computed, unref, watch, type Ref } from 'vue';
import type { TableOpt } from "@/server/types";
import { Loading } from "@/utils/global";
import { useAdminNewsCategory } from "@/composables/admin/news/useAdminNewsCategory";
import { useAdminNewsCategoryDetail } from "@/composables/admin/news/useAdminNewsCategoryDetail";
import type { CategoryNewsDTO, CreateCategoryNewsDTO, UpdateCategoryNewsDTO } from "@/server/types/dto/v1/news.dto";
import { newsAPI } from "@/services/v1/admin/news.service";
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
import { useChangeOrder } from "@/composables/utils/useChangeOrder";
import { useTableUtils } from "@/composables/utils/useTableSearch";
type MaybeRef<T> = T | Ref<T>;

export const useAdminNewsCategoryOperations = (
  defaultForm: object,
  formItem: MaybeRef<CreateCategoryNewsDTO>,
  updateItem: MaybeRef<UpdateCategoryNewsDTO>,
  dataList: Ref<CategoryNewsDTO[] | null>,
  maxOrder: Ref<number>,
  serverItems: Ref<CategoryNewsDTO[]>,
  loadingTable: Ref<Boolean>,
  totalItems: Ref<number>,
  search: Ref<string>,
  searchInput: Ref<string>,
  currentTableOptions: Ref<TableOpt>,
  isTogglePopupAdd: Ref<boolean>,
  isTogglePopupUpdate: Ref<boolean>,
  detailData: Ref<CategoryNewsDTO| null>,
) => {

  const { getListCategoryApi, fetchCategoryList } = useAdminNewsCategory()
  const { getDetailNewsCategoryApi, fetchDetailNewsCategory } = useAdminNewsCategoryDetail()

  const getListData = async () => {
    await fetchCategoryList(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage,search.value)

    if(!getListCategoryApi.value) return
      dataList.value = getListCategoryApi.value.data
      totalItems.value = getListCategoryApi.value.pagination.total
      currentTableOptions.value.page = getListCategoryApi.value.pagination.page
      currentTableOptions.value.itemsPerPage = getListCategoryApi.value.pagination.limit
  }

  const ListAllCategoryApi = {
    async fetch({ items}: {
      items: CategoryNewsDTO[],
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()

          resolve({ items: filtered })
        }, 200)
      })
    },
  }

  async function loadItems( opt: TableOpt ) {
    loadingTable.value = true;

    await getListData();

    const {items} = await ListAllCategoryApi.fetch({
      items: dataList.value || [],
    }) as { items: CategoryNewsDTO[] }
      
    serverItems.value = items
    if(getListCategoryApi.value) totalItems.value = getListCategoryApi.value.pagination.total
    loadingTable.value = false;
  }

  watch(
    () => ({
      page: currentTableOptions.value.page,
      limit: currentTableOptions.value.itemsPerPage,
    }),
    () => {
      loadItems(currentTableOptions.value);
      if(getListCategoryApi.value) {
        maxOrder.value = getListCategoryApi.value.pagination.total
      } else {
        maxOrder.value = 0
      }
    },
    { deep: true }
  )

  const handleTogglePopupAdd = (value: boolean) => {
    handleResetForm()
    if(detailData.value) detailData.value.id = ''
    isTogglePopupAdd.value = value;
  };

  const handleTogglePopupUpdate = (value: boolean) => {
    isTogglePopupUpdate.value = value;
  };

  const handleResetForm = () => {
    Object.assign(formItem, defaultForm)
    Object.assign(updateItem, defaultForm)
  }

  const handleReload = async () => {
    await loadItems(currentTableOptions.value);
  }

  async function submitCreate() {
    Loading(true)
    try {
      const newCategory = unref(formItem)

      const data = await newsAPI.createCategory(newCategory)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupAdd.value = false
        handleResetForm()
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false)
    }
  }

  const handleEdit = async (id:string) => {
    if(!id) return
    await fetchDetailNewsCategory(id)
    detailData.value = getDetailNewsCategoryApi.value
    if(!detailData.value) return
    handleTogglePopupUpdate(true);
    Object.assign(updateItem, detailData.value);
  }

  async function submitUpdate() {
    if(!detailData.value) return
    const id = detailData.value.id
    if(!id) return

    Loading(true);
    try {
      const newCategory = unref(updateItem)

      const data = await newsAPI.updateCategory(id, newCategory)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupUpdate.value = false;
        handleResetForm()
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false)
    }
  }

  const handleDelete = async (id:string) => {
    const confirm = await showConfirm('Bạn có chắc xoá mục này?')
    if (!confirm) return
  
    Loading(true);
    try {
      const data = await newsAPI.deleteCategory(id)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false)
    }
  }

  const { toggleActive } = useToggleActiveStatus(newsAPI.toggleActiveCategory, serverItems );

  const { handleChangeOrder } = useChangeOrder(newsAPI.updateOrderCategory, () => loadItems(currentTableOptions.value));

  const { handleSearch } = useTableUtils(search, searchInput );
  
  const getListOrder = computed(() => {
    return Array.from({ length: maxOrder.value }, (_, i) => i + 1)
  })

  return {
   handleTogglePopupAdd,
    handleTogglePopupUpdate,
    handleEdit,
    handleDelete,
    getListData,
    loadItems,
    submitCreate,
    submitUpdate,
    handleReload,
    handleResetForm,
    toggleActive,
    handleChangeOrder,
    handleSearch,
    getListOrder,
  };
};