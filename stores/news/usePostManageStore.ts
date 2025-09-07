import { ref, reactive, watch, computed } from "vue";
import { defineStore } from "pinia";
import { newsAPI } from "@/services/news.service";
import { Loading} from '@/utils/global'
import type { PostNewsDTO, CreatePostNewsDTO, UpdatePostNewsDTO } from '@/server/types/dto/news.dto'
import type { TableOpt, TableHeaders } from '@/server/types/dto/table-vuetify.dto'
import { showConfirm, showSuccess, showWarning } from "@/utils/toast";
import { useNewsCategory } from '@/composables/news/useNewsCategory'
import { usePostDetail } from '@/composables/news/usePostDetail'
import { usePostAll } from '@/composables/news/usePostAll'
import { useFileManageFolderStore } from '@/stores/file-manage/useFileManageStore'
import { useFileSelectContextStore } from "@/stores/file-manage/useFileSelectContextStore"
import { FOLDER_UPLOAD } from "@/shared/constants/folder-upload";
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";

export const usePostManageStore = defineStore("PostManage", () => {
const { getListCategoryApi, fetchCategoryList } = useNewsCategory()
const { getDetailPostApi, fetchDetailPost } = usePostDetail()
const { getListPostApi, fetchPostList } = usePostAll()
const storeFileManage = useFileManageFolderStore()
const contextStore = useFileSelectContextStore()

const folderName = FOLDER_UPLOAD.POST
const valid = ref<boolean>(false)
const titleRules = [
  (value: string) => {
    if (value) return true
    return 'Tieu de khong duoc trong'
  },
  (value: string) => {
    if (value?.length <= 200) return true
    return 'Tieu de khong duoc qua 10 ky tu'
  },
]

const descriptionRules = [
    (v: string) => !!v && v.replace(/<[^>]*>/g, '').trim().length > 0 || 'Nội dung không được để trống'
]

const catalogRules = [
  (value: string | number) => !!value || 'Vui lòng chọn danh mục'
]

const formPostItem = reactive<CreatePostNewsDTO>({
  title: '',
  description: '',
  image: '',
  summaryContent: '',
  isActive: false,
  categoryId: '',
  author: "Admin"
});

const updatePostItem = reactive<UpdatePostNewsDTO>({
  title: '',
  description: '',
  image: '',
  summaryContent: '',
  isActive: false,
  categoryId: '',
});


//state list
const dataList = ref<PostNewsDTO[]| null>(null);
const itemsPerPage = 10
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
  itemsPerPage: itemsPerPage,
  sortBy: [],
})
const filterCategory = ref<string>()
const isTogglePopupUpdate = ref<boolean>(false);
const detailData = ref<PostNewsDTO|null>(null);
const isTogglePopupAdd = ref<boolean>(false);


const getListData = async () => {
  await fetchPostList()
  dataList.value = getListPostApi.value
}

const ListDataApi = {
    async fetch ({ page, itemsPerPage, sortBy, search, filterCategory }:{ page: TableOpt["page"], itemsPerPage: TableOpt["itemsPerPage"], sortBy: TableOpt["sortBy"], search: { title: string }, filterCategory?: string }) {
      return new Promise(resolve => {
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage
          const items = dataList.value?.slice().filter(item => {
            if (search.title && !item.title.toLowerCase().includes(search.title.toLowerCase())) {
              return false
            }
            if (filterCategory && item.categoryId !== filterCategory ) {
              return false
            }
            return true
          })
          if (sortBy.length) {
            const sortKey = sortBy[0].key
            const sortOrder = sortBy[0].order
            items?.sort((a:any, b:any) => {
              const aValue = a[sortKey]
              const bValue = b[sortKey]
              return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
            })
          }
          const paginated = items?.slice(start, end === -1 ? undefined : end)
          resolve({ items: paginated, total: items?.length })
        }, 500)
      })
    },
  }
  
  async function loadItems(opt:TableOpt) {
    loadingTable.value = true;

    await getListData();

    const { items, total } = await ListDataApi.fetch({
        page: opt.page,
        itemsPerPage: opt.itemsPerPage,
        sortBy: opt.sortBy,
        search: { title: name.value }, filterCategory: filterCategory.value
      }) as { items: PostNewsDTO[]; total: number };
      serverItems.value = items;
      totalItems.value = total;
      loadingTable.value = false;
  }

  watch([name,filterCategory], () => {
    loadItems(currentTableOptions.value);
  })

  watch(dataList, (newVal) => {
    dataList.value = newVal;
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
    formPostItem.title = ''
    formPostItem.description = ''
    formPostItem.summaryContent = ''
    formPostItem.image = ''
    formPostItem.isActive = false
    formPostItem.categoryId = ''
    formPostItem.author = "Admin"

    //update
    updatePostItem.title = ''
    updatePostItem.description = ''
    updatePostItem.summaryContent = ''
    updatePostItem.image = ''
    updatePostItem.isActive = false
    updatePostItem.categoryId = ''
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

  // doi kich hoat
  const { toggleActive } = useToggleActiveStatus(newsAPI.toggleActivePost, serverItems );

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
    // state
    valid,
    dataList,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    titleRules,
    descriptionRules,
    catalogRules,
    detailData,
    formPostItem,
    updatePostItem,
    serverItems,
    loadingTable,
    totalItems,
    name,
    search,
    itemsPerPage,
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
