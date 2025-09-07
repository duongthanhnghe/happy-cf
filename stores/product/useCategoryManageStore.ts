import { ref, reactive, watch, computed } from "vue";
import { defineStore } from "pinia";
import { categoriesAPI } from "@/services/categories-product.service";
import {
  Loading
} from '@/utils/global'
import type { CategoryProductDTO, CreateCategoryProductDTO, UpdateCategoryProductDTO } from '@/server/types/dto/product.dto'
import type { TableOpt, TableHeaders } from '@/server/types/dto/table-vuetify.dto'
import { showSuccess, showWarning, showConfirm } from "@/utils/toast";
import { useProductCategory } from '@/composables/product/useProductCategory'
import { useProductCategoryDetail } from '@/composables/product/useProductCategoryDetail'
import { useFileManageFolderStore } from '@/stores/file-manage/useFileManageStore'
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
import { useChangeOrder } from "@/composables/utils/useChangeOrder";

export const useCategoryManageStore = defineStore("CategoryManage", () => {

const { getListCategoryAll, fetchCategoryList } = useProductCategory()
const { getProductCategoryDetail, fetchProductCategoryDetail } = useProductCategoryDetail()
const storeFileManage = useFileManageFolderStore();

//state global  
const valid = ref<boolean>(false)
const categoryNameRules = [
  (value:string) => {
    if (value) return true
    return 'Ten khong duoc trong'
  },
  (value:string) => {
    if (value?.length <= 100) return true
    return 'Ten khong duoc qua 100 ky tu'
  },
]
const formCategoryItem = reactive<CreateCategoryProductDTO>({
  categoryName: '',
  description: '',
  image: '',
  isActive: false
});

const updateCategoryItem = reactive<UpdateCategoryProductDTO>({
  id: '',
  categoryName: '',
  description: '',
  image: '',
  isActive: false
});

//state list
const dataListCategory = ref<CategoryProductDTO[] | null>(null);
const maxOrder = ref<number>(0)
const itemsPerPage = 10
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Hinh anh', key: 'image', sortable: false, },
    {
      title: 'Ten danh muc',
      sortable: false,
      key: 'categoryName',
    },
    { title: 'Mo ta', key: 'description', sortable: false, },
    { title: 'Tinh trang', key: 'isActive', sortable: false, },
    { title: '', key: 'actions', sortable: false},
  ])
  const serverItems = ref<CategoryProductDTO[]>([])
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
const detailData = ref<CategoryProductDTO | null>(null);
const isTogglePopupAdd = ref<boolean>(false);


const getListAllCategory = async () => {
  await fetchCategoryList()
  if(getListCategoryAll.value) dataListCategory.value = getListCategoryAll.value
}

const ListAllCategoryApi = {
    async fetch ({ page, itemsPerPage, sortBy, search }: {
      page: TableOpt['page'],
      itemsPerPage: TableOpt['itemsPerPage'],
      sortBy: TableOpt['sortBy'],
      search: { categoryName?: string }
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage
          const items = dataListCategory.value?.slice().filter(item => {
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
  
  async function loadItemsCategory( opt: TableOpt ) {
    loadingTable.value = true;

    await getListAllCategory();

    const {items, total} = await ListAllCategoryApi.fetch({
      page: opt.page,
      itemsPerPage: opt.itemsPerPage,
      sortBy: opt.sortBy,
      search: { categoryName: name.value }
    }) as { items: CategoryProductDTO[], total: number }
     
    serverItems.value = items;
    totalItems.value = total;
    loadingTable.value = false;
  }

  watch(name, () => {
    search.value = String(Date.now())
  })

  watch(dataListCategory, (newVal) => {
    dataListCategory.value = newVal;

    // tinh max order
    if(newVal && newVal.length > 0) {
      maxOrder.value = Math.max(...newVal.map(item => item.order))
    } else {
      maxOrder.value = 0
    }
  })

  //actions global
  const handleTogglePopupAdd = (value: boolean) => {
    updateCategoryItem.id = ''
    isTogglePopupAdd.value = value;
  };

  const handleTogglePopupUpdate = (value: boolean) => {
    isTogglePopupUpdate.value = value;
  };

  const handleResetFormCategoryItem = () => {
    formCategoryItem.categoryName = ''
    formCategoryItem.description = ''
    formCategoryItem.image = ''
    formCategoryItem.isActive = false

    //update
    updateCategoryItem.id = ''
    updateCategoryItem.categoryName = ''
    updateCategoryItem.description = ''
    updateCategoryItem.image = ''
    updateCategoryItem.isActive = false
  }

  const handleReload = async () => {
    await loadItemsCategory(currentTableOptions.value);
  }

  //actions add
  async function submitCreate() {
    Loading(true);
    try {
      const newCategory = {...formCategoryItem}

      const data = await categoriesAPI.create(newCategory)
      if(data.code === 0) {
        showSuccess(data.message)
        isTogglePopupAdd.value = false;
        handleResetFormCategoryItem()
        handleReload()
      } else showWarning(data.message)
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  //actions edit
  const handleEditCategory = async (id: string) => {
    if(!id) return
    await fetchProductCategoryDetail(id)
    if(getProductCategoryDetail.value) detailData.value = getProductCategoryDetail.value
    if(!detailData.value) return
    handleTogglePopupUpdate(true);
    Object.assign(updateCategoryItem, detailData.value);
  }

  async function submitUpdate() {
    Loading(true);
    try {
      const newCategory = {...updateCategoryItem}
      const data = await categoriesAPI.update(newCategory.id, newCategory)
      if(data.code === 0){
        showSuccess(data.message)
        isTogglePopupUpdate.value = false;
        handleResetFormCategoryItem()
        handleReload()
      } else showWarning(data.message)
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
}

  //actions delete
  const handleDeleteCategory = async (id: string) => {
    const confirmed = await showConfirm('Bạn có chắc xoá?')
    if (!confirmed) return

    Loading(true);
    try {
      const data = await categoriesAPI.delete(id)
      if(data.code === 1) showWarning(data.message)
      else {
        if(dataListCategory.value){
          dataListCategory.value = dataListCategory.value.filter(item => 
            item.id !== id
          )
        }
        handleReload()
        showSuccess(data.message)
      }
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  // doi kich hoat
  const { toggleActive } = useToggleActiveStatus(categoriesAPI.toggleActive, serverItems );

  // change order
  const { handleChangeOrder } = useChangeOrder(categoriesAPI.updateOrder, () => loadItemsCategory(currentTableOptions.value));

  const handleAddImage = () => {
    storeFileManage.handleTogglePopup(true)
  }

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return
    const target = updateCategoryItem.id ? updateCategoryItem : formCategoryItem
    target.image = newValue.url
  })

  const getListOrder = computed(() => {
    return Array.from({ length: maxOrder.value }, (_, i) => i + 1)
  })

  return {
    // state
    valid,
    dataListCategory,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    categoryNameRules,
    detailData,
    formCategoryItem,
    updateCategoryItem,
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
    handleEditCategory,
    handleDeleteCategory,
    getListAllCategory,
    loadItemsCategory,
    submitCreate,
    submitUpdate,
    handleReload,
    handleResetFormCategoryItem,
    handleAddImage,
    toggleActive,
    handleChangeOrder,
    getListOrder,
  };
});
