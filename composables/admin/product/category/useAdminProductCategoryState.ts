import type { TableHeaders, TableOpt } from '@/server/types';
import type { CategoryProductDTO, CreateCategoryProductDTO, UpdateCategoryProductDTO } from '@/server/types/dto/v1/product.dto';
import { ref } from 'vue';
import { reactive } from 'vue';
import { nullRules, nullAndSpecialRules } from '@/utils/validation'

export const useAdminProductCategoryState = () => {
  
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
  const dataListCategory = ref<CategoryProductDTO[] | null>(null);
  const maxOrder = ref<number>(0)
  const itemsPerPage = 20
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Hình ảnh', key: 'image', sortable: false, },
    { title: 'Banner', key: 'banner', sortable: false, },
    { title: 'Tên danh mục', sortable: false, key: 'categoryName'},
    { title: 'Danh mục cha', key: 'parent', sortable: false, },
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

  return {
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
    currentImageType,
    maxOrder,
    defaultForm,
  };
};