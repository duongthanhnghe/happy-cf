import { ref, reactive, watch, computed } from "vue";
import { defineStore } from "pinia";
import { newsAPI } from "@/services/v1/news.service";
import { Loading} from '@/utils/global'
import type { PostNewsDTO, CreatePostNewsDTO, UpdatePostNewsDTO } from '@/server/types/dto/v1/news.dto'
import type { TableOpt, TableHeaders } from '@/server/types/dto/v1/table-vuetify.dto'
import { showConfirm, showSuccess, showWarning } from "@/utils/toast";
import { useNewsCategory } from '@/composables/news/useNewsCategory'
import { usePostDetail } from '@/composables/news/usePostDetail'
import { usePostAll } from '@/composables/news/usePostAll'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { useFileSelectContextStore } from "@/stores/admin/file-manage/useFileSelectContextStore"
import { FOLDER_UPLOAD } from "@/shared/constants/folder-upload";
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
import { nullRules, nullAndSpecialRules } from '@/utils/validation'
import { useSeoWatchers } from "@/utils/seoHandle";

export const usePostManageStore = defineStore("PostManage", () => {
const { getListCategoryApi, fetchCategoryList } = useNewsCategory()
const { getDetailPostApi, fetchDetailPost } = usePostDetail()
const { getListPostApi, fetchPostList } = usePostAll()
const storeFileManage = useFileManageFolderStore()
const contextStore = useFileSelectContextStore()

const folderName = FOLDER_UPLOAD.POST

const defaultForm: CreatePostNewsDTO = {
  title: '',
  description: '',
  image: '',
  summaryContent: '',
  isActive: false,
  categoryId: '',
  author: "Admin",
  // SEO
  titleSEO: '',
  descriptionSEO: '',
  slug: '',
  keywords: []
};

const formPostItem = reactive<CreatePostNewsDTO>({ ...defaultForm })

const updatePostItem = reactive<CreatePostNewsDTO>({ ...defaultForm })

//state list
const dataList = ref<PostNewsDTO[]| null>(null);
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Hinh anh', key: 'image', sortable: false, },
    { title: 'Tieu de', key: 'title', sortable: false, },
    // { title: 'Mo ta', key: 'summaryContent', sortable: false, },
    // { title: 'Noi dung', key: 'description', sortable: false, },
    { title: 'Luot xem', key: 'views', sortable: false, },
    { title: 'Danh muc', key: 'categoryId', sortable: false, },
    { title: 'Tinh trang', key: 'isActive', sortable: false, },
    { title: '', key: 'actions', sortable: false },
  ])
  const serverItems = ref<PostNewsDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const totalItems = ref<number>(0)
  const name = ref<string>('')
  const search = ref<string>('')
  const currentTableOptions = ref<TableOpt>({
  page: 1,
  itemsPerPage: 20,
  sortBy: [],
})
const filterCategory = ref<string>()
const isTogglePopupUpdate = ref<boolean>(false);
const detailData = ref<PostNewsDTO|null>(null);
const isTogglePopupAdd = ref<boolean>(false);


const getListData = async () => {
  await fetchPostList(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage)

  if(!getListPostApi.value) return
  dataList.value = getListPostApi.value.data
  totalItems.value = getListPostApi.value.pagination.total
  currentTableOptions.value.page = getListPostApi.value.pagination.page
  currentTableOptions.value.itemsPerPage = getListPostApi.value.pagination.limit
}

const ListDataApi = {
  async fetch({ items, sortBy, search, filterCategory }: {
    items: PostNewsDTO[],
    sortBy: TableOpt["sortBy"],
    search: { title: string },
    filterCategory?: string
  }) {
    return new Promise(resolve => {
      setTimeout(() => {
        let filtered = items.slice()

        if (search.title) {
          filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(search.title.toLowerCase())
          )
        }
        if (filterCategory) {
          filtered = filtered.filter(item => item.categoryId === filterCategory)
        }

        if (sortBy.length) {
          const sortKey = sortBy[0].key
          const sortOrder = sortBy[0].order
          filtered.sort((a: any, b: any) => {
            const aValue = a[sortKey]
            const bValue = b[sortKey]
            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
          })
        }

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
      sortBy: opt.sortBy,
      search: { title: name.value },
      filterCategory: filterCategory.value
    }) as { items: PostNewsDTO[] }

    serverItems.value = items
    if(getListPostApi.value) totalItems.value = getListPostApi.value.pagination.total

    loadingTable.value = false
  }

  watch([name,filterCategory], () => {
    loadItems(currentTableOptions.value);
  })

  watch(() => [currentTableOptions.value.page,currentTableOptions.value.itemsPerPage], () => {
    loadItems(currentTableOptions.value);
  })

  const getCategoryName = (id:string) => {
    if(getListCategoryApi.value.length === 0) fetchCategoryList()
    return getListCategoryApi.value.find(item => item.id === id)
  }

  //actions global
  const handleTogglePopupAdd = (value:boolean) => {
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

  //actions add
  async function submitCreate() {
    Loading(true);
    try {
      const bodyData = { ...formPostItem };
      const data = await newsAPI.createPost(bodyData)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupAdd.value = false;
        handleResetForm()
        handleReload()  
      } else {
        showWarning(data.message ?? '')
      }
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
    }
    Loading(false);
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
      const bodyData = { ...updatePostItem };
      const data = await newsAPI.updatePost(id, bodyData)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupUpdate.value = false;
        handleResetForm()
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
    }
    Loading(false);
  }

  const handleDelete = async (id:string) => {
    const confirm = await showConfirm('Bạn có chắc xoá mục này?')
    if (!confirm) return
  
    Loading(true);
    try {
      const data = await newsAPI.deletePost(id)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        if(dataList.value){
          dataList.value = dataList.value.filter(item => 
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

  const { toggleActive } = useToggleActiveStatus(newsAPI.toggleActivePost, serverItems );

  // SEO
  useSeoWatchers(formPostItem, { sourceKey: 'title', autoSlug: true, autoTitleSEO: true })
  useSeoWatchers(updatePostItem, { sourceKey: 'title', autoSlug: true, autoTitleSEO: true })

  const handleAddImage = () => {
    contextStore.setContext("post")
    storeFileManage.handleTogglePopup(true)
  }

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return
    if (contextStore.context?.includes("post")) {
      const target = detailData.value?.id ? updatePostItem : formPostItem
      target.image = newValue.url
    }
  })

  watch(() => getListCategoryApi.value, async (newValue) => {
    if(newValue.length === 0) await fetchCategoryList()
  }, { immediate: true })


  const getListCategory = computed(() => getListCategoryApi.value)

  return {
    dataList,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    nullRules,
    detailData,
    formPostItem,
    updatePostItem,
    serverItems,
    loadingTable,
    totalItems,
    name,
    search,
    // itemsPerPage,
    headers,
    currentTableOptions,
    filterCategory,
    folderName,
    // actions
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
    getCategoryName,
    handleAddImage,
    toggleActive,
    getListCategory,
  };
});
