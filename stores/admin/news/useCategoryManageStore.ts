import { ref, reactive, watch, computed } from "vue";
import { defineStore } from "pinia";
import { newsAPI } from "@/services/v1/news.service";
import { nullRules, nullAndSpecialRules } from '@/utils/validation'
import {
  Loading, generateSlug
} from '@/utils/global'
import type { CategoryNewsDTO, CreateCategoryNewsDTO, UpdateCategoryNewsDTO } from '@/server/types/dto/v1/news.dto'
import type { TableOpt, TableHeaders } from '@/server/types/dto/v1/table-vuetify.dto'
import { showConfirm, showSuccess, showWarning } from "@/utils/toast";
import { useNewsCategory } from '@/composables/news/useNewsCategory'
import { useNewsCategoryDetail } from '@/composables/news/useNewsCategoryDetail'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
import { useChangeOrder } from "@/composables/utils/useChangeOrder";
import { useSeoWatchers } from "@/utils/seoHandle";

export const useCategoryManageStore = defineStore("CategoryNewsManage", () => {

const { getListCategoryApi, fetchCategoryList } = useNewsCategory()
const { getDetailNewsCategoryApi, fetchDetailNewsCategory } = useNewsCategoryDetail()
const storeFileManage = useFileManageFolderStore();
  
//state global  
const defaultForm: CreateCategoryNewsDTO = {
  categoryName: '',
  description: '',
  image: '',
  summaryContent: '',
  isActive: false,
  // SEO
  titleSEO: '',
  descriptionSEO: '',
  slug: '',
  keywords: []
};

const formItem = reactive<CreateCategoryNewsDTO>({ ...defaultForm })

const updateItem = reactive<UpdateCategoryNewsDTO>({ ...defaultForm })

//state list
const dataList = ref<CategoryNewsDTO[] | null>(null);
const maxOrder = ref<number>(0)
const itemsPerPage = 10
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Hinh anh', key: 'image', sortable: false, },
    { title: 'Ten danh muc', key: 'categoryName', sortable: false, },
    { title: 'Noi dung', key: 'description', sortable: false, },
    { title: 'Mo ta', key: 'summaryContent', sortable: false, },
    { title: 'Tinh trang', key: 'isActive', sortable: false, },
    { title: '', key: 'actions', sortable: false },
  ])
  const serverItems = ref<CategoryNewsDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const totalItems = ref<number>(0)
  const name = ref<string>('')
  const search = ref<string>('')
  const currentTableOptions = ref<TableOpt>({
  page: 1,
  itemsPerPage: itemsPerPage,
  sortBy: [],
})
const isTogglePopupUpdate = ref<boolean>(false);
const detailData = ref<CategoryNewsDTO|null>(null);
const isTogglePopupAdd = ref<boolean>(false);


const getListData = async () => {
  await fetchCategoryList()
  dataList.value = getListCategoryApi.value
}

const ListAllCategoryApi = {
    async fetch ({
      page, itemsPerPage, sortBy,
      search,
    }:{ page: TableOpt["page"],itemsPerPage: TableOpt["itemsPerPage"],sortBy: TableOpt["sortBy"],search: { categoryName: string }} ) {
      return new Promise(resolve => {
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage
          const items = dataList.value?.slice().filter(item => {
            if (search.categoryName && !item.categoryName.toLowerCase().includes(search.categoryName.toLowerCase())) {
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

  async function loadItems(opt: TableOpt) {
    loadingTable.value = true
    await getListData()

    const { items, total } = await ListAllCategoryApi.fetch({
      page: opt.page,
      itemsPerPage: opt.itemsPerPage,
      sortBy: opt.sortBy,
      search: { categoryName: name.value },
    }) as { items: CategoryNewsDTO[]; total: number }

    serverItems.value  = items
    totalItems.value   = total
    loadingTable.value = false
  }

  watch(name, () => {
    search.value = String(Date.now())
  })

  watch(dataList, (newVal) => {
    dataList.value = newVal;

    // tinh max order
    if(newVal && newVal.length > 0) {
      maxOrder.value = Math.max(...newVal.map(item => item.order))
    } else {
      maxOrder.value = 0
    }
  })

  //actions global
  const handleTogglePopupAdd = (value: boolean) => {
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

  //actions add
  async function submitCreate() {
    Loading(true)
    try {
      const newCategory = {...formItem}

      const data = await newsAPI.createCategory(newCategory)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupAdd.value = false
        handleResetForm()
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
      Loading(true)
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
      const newCategory = {...updateItem}

      const data = await newsAPI.updateCategory(id, newCategory)
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

  //actions delete
  const handleDelete = async (id:string) => {
    const confirm = await showConfirm('Bạn có chắc xoá mục này?')
    if (!confirm) return
  
    Loading(true);
    try {
      const data = await newsAPI.deleteCategory(id)
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
  const { toggleActive } = useToggleActiveStatus(newsAPI.toggleActiveCategory, serverItems );

  // change order
  const { handleChangeOrder } = useChangeOrder(newsAPI.updateOrderCategory, () => loadItems(currentTableOptions.value));

  const handleAddImage = () => {
    storeFileManage.handleTogglePopup(true)
  }

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return
    const target = detailData.value?.id ? updateItem : formItem
    target.image = newValue.url
  })

  // SEO
  useSeoWatchers(formItem, { sourceKey: 'categoryName', autoSlug: true, autoTitleSEO: true })
  useSeoWatchers(updateItem, { sourceKey: 'categoryName', autoSlug: true, autoTitleSEO: true })

  const getListOrder = computed(() => {
    return Array.from({ length: maxOrder.value }, (_, i) => i + 1)
  })

  return {
    dataList,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    nullAndSpecialRules,
    nullRules,
    detailData,
    formItem,
    updateItem,
    serverItems,
    loadingTable,
    totalItems,
    name,
    search,
    itemsPerPage,
    headers,
    currentTableOptions,
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
    handleAddImage,
    toggleActive,
    handleChangeOrder,
    getListOrder,
  };
});
