import { ref, reactive, watch, computed } from "vue";
import { defineStore } from "pinia";
import { categoriesAPI } from "@/services/v1/admin/categories-product.service";
import { Loading } from '@/utils/global'
import type { CategoryProductDTO, CreateCategoryProductDTO, UpdateCategoryProductDTO } from '@/server/types/dto/v1/product.dto'
import type { TableOpt, TableHeaders } from '@/server/types/dto/v1/table-vuetify.dto'
import { showSuccess, showWarning, showConfirm } from "@/utils/toast";
import { useAdminProductCategory } from '@/composables/product/useAdminProductCategory'
import { useAdminProductCategoryTree } from '@/composables/product/useAdminProductCategoryTree'
import { useAdminProductCategoryDetail } from '@/composables/product/useAdminProductCategoryDetail'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
import { useChangeOrder } from "@/composables/utils/useChangeOrder";
import { nullRules, nullAndSpecialRules } from '@/utils/validation'
import { useSeoWatchers } from "@/utils/seoHandle";
import { findItemInTree, markAllSelectable } from '@/utils/treeHelpers'

export const useCategoryManageStore = defineStore("CategoryManage", () => {

  const { getListCategoryAll, fetchCategoryList } = useAdminProductCategory()
  const { getListCategoryAllTree, fetchCategoryListTree } = useAdminProductCategoryTree()
  const { getProductCategoryDetail, fetchProductCategoryDetail } = useAdminProductCategoryDetail()
  const storeFileManage = useFileManageFolderStore();

  const defaultForm: CreateCategoryProductDTO = {
    categoryName: '',
    description: '',
    image: '',
    banner: '',
    isActive: false,
    parentId: null,
    titleSEO: '',
    descriptionSEO: '',
    slug: '',
    keywords: []
  };
  const formCategoryItem = reactive<CreateCategoryProductDTO>({ ...defaultForm })
  const updateCategoryItem = reactive<UpdateCategoryProductDTO>({ ...defaultForm, id: '' })
  const selectedCategory = ref<CategoryProductDTO[]>([])
  const selectedCategoryName = ref<string[]>([])
  const treeItems = computed(() => {
    const items = getListCategoryAllTree.value ?? []
    return markAllSelectable(items)
  })
  const treeItemsForEdit = computed(() => {
    const items = getListCategoryAllTree.value ?? []
    return markAllSelectable(items, updateCategoryItem.id)
  })
  const dataListCategory = ref<CategoryProductDTO[] | null>(null);
  const maxOrder = ref<number>(0)
  const itemsPerPage = 50
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Hình ảnh', key: 'image', sortable: false, },
    { title: 'Banner', key: 'banner', sortable: false, },
    { title: 'Tên danh mục', sortable: false, key: 'categoryName'},
    { title: 'Danh mục cha', key: 'parentId', sortable: false, },
    { title: 'Tình trạng', key: 'isActive', sortable: false, },
    { title: '', key: 'actions', sortable: false, headerProps: { class: 'v-data-table-sticky-cl-right' },
    cellProps: { class: 'v-data-table-sticky-cl-right' }},
  ])
  const serverItems = ref<CategoryProductDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const totalItems = ref<number>(0)
  const search = ref<string>('')
  const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage: itemsPerPage,
    sortBy: [],
  })
  const isTogglePopupUpdate = ref<boolean>(false);
  const isTogglePopupAdd = ref<boolean>(false);
  const currentImageType = ref<'image' | 'banner' | null>(null)

  const handleTogglePopupAdd = (value: boolean) => {
    handleResetFormCategoryItem()
    updateCategoryItem.id = ''
    isTogglePopupAdd.value = value;
  };

  const handleTogglePopupUpdate = (value: boolean) => {
    handleResetFormCategoryItem()
    isTogglePopupUpdate.value = value;
  };

  const handleResetFormCategoryItem = () => {
    Object.assign(formCategoryItem, defaultForm)
    Object.assign(updateCategoryItem, defaultForm)

    selectedCategory.value = []
    selectedCategoryName.value = []
    fetchCategoryListTree()
  }

  const handleReload = async () => {
    await loadItemsCategory(currentTableOptions.value);
  }

  const getCategoryName = (id: string) => {
    if (!getListCategoryAll.value) return;
    return getListCategoryAll.value.find(item => item.id === id)
  }

  const getListAllCategory = async () => {
    await fetchCategoryList(search.value)
    if(getListCategoryAll.value) dataListCategory.value = getListCategoryAll.value
  }

  const ListAllCategoryApi = {
    async fetch ({ page, itemsPerPage }: {
      page: TableOpt['page'],
      itemsPerPage: TableOpt['itemsPerPage'],
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage
          const items = dataListCategory.value
         
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
    }) as { items: CategoryProductDTO[], total: number }
     
    serverItems.value = items;
    totalItems.value = total;
    loadingTable.value = false;
  }

  watch(
    async () => [search.value, currentTableOptions.value.page, currentTableOptions.value.itemsPerPage],
    async () => {
      await loadItemsCategory(currentTableOptions.value);
      if(getListCategoryAll.value && getListCategoryAll.value.length > 0) {
        maxOrder.value = Math.max(...getListCategoryAll.value.map(item => item.order))
      } else {
        maxOrder.value = 0
      }
    }
  );

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
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleEditCategory = async (id: string) => {
    if(!id) return
    await fetchProductCategoryDetail(id)
    if(!getProductCategoryDetail.value) return
    handleTogglePopupUpdate(true);
    Object.assign(updateCategoryItem, getProductCategoryDetail.value);
    if(updateCategoryItem.parentId) setSelectedCategory(updateCategoryItem.parentId)
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
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleDeleteCategory = async (id: string) => {
    const confirmed = await showConfirm('Bạn có chắc xoá?')
    if (!confirmed) return

    Loading(true);
    try {
      const data = await categoriesAPI.delete(id)
      if(data.code === 1) showWarning(data.message)
      else {
        handleReload()
        showSuccess(data.message)
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  // chang active
  const { toggleActive } = useToggleActiveStatus(categoriesAPI.toggleActive, serverItems );

  // change order
  const { handleChangeOrder } = useChangeOrder(categoriesAPI.updateOrder, () => loadItemsCategory(currentTableOptions.value));

  const getListOrder = computed(() => {
    return Array.from({ length: maxOrder.value }, (_, i) => i + 1)
  })

  //upload image
  const handleAddImage = (type: 'image' | 'banner') => {
    currentImageType.value = type;
    storeFileManage.handleTogglePopup(true);
  }

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return

    const target = updateCategoryItem.id ? updateCategoryItem : formCategoryItem

    if (currentImageType.value === 'image') {
      target.image = newValue.url
    } else if (currentImageType.value === 'banner') {
      target.banner = newValue.url
    }

    currentImageType.value = null
  })

  // SEO
  useSeoWatchers(formCategoryItem, { sourceKey: 'categoryName', autoSlug: true, autoTitleSEO: true })
  useSeoWatchers(updateCategoryItem, { sourceKey: 'categoryName', autoSlug: true, autoTitleSEO: true })

  // Tree category
  const setSelectedCategory = (parentId: string | null) => {
    if (parentId) {
      const sourceTree = updateCategoryItem.id ? treeItemsForEdit.value : treeItems.value
      const parentCategory = findItemInTree(sourceTree, parentId)
      if (parentCategory) {
        selectedCategory.value = [parentCategory]
        selectedCategoryName.value = [parentCategory.categoryName]
      }
    } else {
      selectedCategory.value = []
      selectedCategoryName.value = []
    }
  }

  watch(selectedCategory, (val) => {
    if (val.length > 0) {
      if(updateCategoryItem.id) updateCategoryItem.parentId = val[0].id;
      else formCategoryItem.parentId = val[0].id;
      selectedCategoryName.value = val.map(cat => cat.categoryName);
    } else {
      formCategoryItem.parentId = null;
      updateCategoryItem.parentId = null;
      selectedCategoryName.value = [];
    }
  })

  watch(getListCategoryAllTree, (newValue) => {
    if(newValue?.length === 0 && newValue) fetchCategoryListTree()
  }, { immediate: true})


  return {
    // state
    dataListCategory,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    nullRules,
    nullAndSpecialRules,
    formCategoryItem,
    updateCategoryItem,
    serverItems,
    loadingTable,
    totalItems,
    search,
    itemsPerPage,
    headers,
    currentTableOptions,
    selectedCategory,
    selectedCategoryName,
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
    getCategoryName,
    getListOrder,
    getListCategoryAll,
    getListCategoryAllTree,
    treeItems,
    treeItemsForEdit,
  };
});
