import { showWarning, showConfirm, showSuccess } from "@/utils/toast";
import { computed, unref, watch, type Ref } from 'vue';
import type { TableOpt } from "@/server/types";
import { Loading } from "@/utils/global";
import type { CreatePostNewsDTO, PostNewsDTO } from "@/server/types/dto/v1/news.dto";
import { newsAPI } from "@/services/v1/admin/news.service";
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
import { useAdminPostDetail } from '@/composables/admin/news/useAdminPostDetail'
import { useAdminPostAll } from '@/composables/admin/news/useAdminPostAll'
import { useAdminNewsCategory } from '@/composables/admin/news/useAdminNewsCategory'
import { useTableUtils } from "@/composables/utils/useTableSearch";
type MaybeRef<T> = T | Ref<T>;

export const useAdminPostNewsOperations = (
  defaultForm: object,
  formPostItem: MaybeRef<CreatePostNewsDTO>,
  updatePostItem: MaybeRef<CreatePostNewsDTO>,
  dataList: Ref<PostNewsDTO[] | null>,
  serverItems: Ref<PostNewsDTO[]>,
  loadingTable: Ref<Boolean>,
  totalItems: Ref<number>,
  search: Ref<string>,
  searchInput: Ref<string>,
  currentTableOptions: Ref<TableOpt>,
  isTogglePopupAdd: Ref<boolean>,
  isTogglePopupUpdate: Ref<boolean>,
  detailData: Ref<PostNewsDTO| null>,
  filterCategory: Ref<string>,
) => {

  const { getDetailPostApi, fetchDetailPost } = useAdminPostDetail()
  const { getListPostApi, fetchPostList } = useAdminPostAll()
  const { getListCategoryApi, fetchCategoryList } = useAdminNewsCategory()

  const getListData = async () => {
    await fetchPostList(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage,search.value,filterCategory.value)
  
    if(!getListPostApi.value) return
    dataList.value = getListPostApi.value.data
    totalItems.value = getListPostApi.value.pagination.total
    currentTableOptions.value.page = getListPostApi.value.pagination.page
    currentTableOptions.value.itemsPerPage = getListPostApi.value.pagination.limit
  
    if(!getListCategoryApi.value) await fetchCategoryList(1,999,'')
  }
  
  const ListDataApi = {
    async fetch({ items }: {
      items: PostNewsDTO[],
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()
  
          resolve({ items: filtered })
        }, 200)
      })
    },
  }
  
  async function loadItems(opt: TableOpt) {
    loadingTable.value = true

    await getListData()

    const { items } = await ListDataApi.fetch({
      items: dataList.value || [],
    }) as { items: PostNewsDTO[] }

    serverItems.value = items
    if(getListPostApi.value) totalItems.value = getListPostApi.value.pagination.total

    loadingTable.value = false
  }

  watch(
    () => ({
      filterCategory: filterCategory.value,
      page: currentTableOptions.value.page,
      limit: currentTableOptions.value.itemsPerPage,
    }),
    () => {
      loadItems(currentTableOptions.value)
    },
    { deep: true }
  )

  const handleTogglePopupAdd = (value:boolean) => {
    handleResetForm()
    if(detailData.value) detailData.value.id = ''
    isTogglePopupAdd.value = value;
  };

  const handleTogglePopupUpdate = (value:boolean) => {
    isTogglePopupUpdate.value = value;
  };

  const handleResetForm = () => {
    Object.assign(formPostItem, defaultForm)
    Object.assign(updatePostItem, defaultForm)
  }
  
  const handleReload = async () => {
    await loadItems(currentTableOptions.value);
  }

  async function submitCreate() {
    Loading(true);

    try {
      const bodyData = unref(formPostItem);
      const data = await newsAPI.createPost(bodyData)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupAdd.value = false;
        handleResetForm()
        handleReload()  
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleEdit = async (idPost:string) => {
    if(!idPost) return
    await fetchDetailPost(idPost)
    detailData.value = getDetailPostApi.value
    if(!detailData.value) return
    handleTogglePopupUpdate(true);
    Object.assign(updatePostItem, detailData.value);
  }

  async function submitUpdate() {
    if(!detailData.value) return
    const id = detailData.value.id
    if(!id) return

    Loading(true);
    try {
      const bodyData = unref(updatePostItem);
      const data = await newsAPI.updatePost(id, bodyData)
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
      Loading(false);
    }
  }

  const handleDelete = async (id:string) => {
    const confirm = await showConfirm('Bạn có chắc xoá mục này?')
    if (!confirm) return
  
    Loading(true);
    try {
      const data = await newsAPI.deletePost(id)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const { toggleActive } = useToggleActiveStatus(newsAPI.toggleActivePost, serverItems );

  const { handleSearch } = useTableUtils(search, searchInput );

  const getListCategory = computed(() => getListCategoryApi.value?.data)

  const resetFilter = () => {
    searchInput.value,
    search.value = ''
    filterCategory.value = ''
    currentTableOptions.value.page = 1
    currentTableOptions.value.itemsPerPage = 20
  }

  const hasFilter = computed(() => {
    return (
      search.value !== '' ||
      filterCategory.value !== '' ||
      currentTableOptions.value.page !== 1 ||
      currentTableOptions.value.itemsPerPage !== 20
    )
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
    getListCategory,
    resetFilter,
    handleSearch,
    hasFilter,
  };
};