import { reactive, ref } from 'vue';
import type { TableHeaders, TableOpt } from "@/server/types";
import type { CategoryNewsDTO, CreateCategoryNewsDTO, UpdateCategoryNewsDTO } from "@/server/types/dto/v1/news.dto";

export const useAdminNewsCategoryState = () => {

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
  const dataList = ref<CategoryNewsDTO[]| null>(null);
  const maxOrder = ref<number>(0)
  const itemsPerPage = 10
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
  { title: 'Hình ảnh', key: 'image', sortable: false },
  { title: 'Tên danh mục', key: 'categoryName', sortable: false },
  { title: 'Tình trạng', key: 'isActive', sortable: false },
  { title: '', key: 'actions', sortable: false },
  ])
  const serverItems = ref<CategoryNewsDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const totalItems = ref<number>(0)
  const search = ref<string>('')
  const searchInput = ref<string>('')
  const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage: itemsPerPage,
    sortBy: [],
  })
  const isTogglePopupUpdate = ref<boolean>(false);
  const detailData = ref<CategoryNewsDTO|null>(null);
  const isTogglePopupAdd = ref<boolean>(false);

  return {
    defaultForm,
   dataList,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    detailData,
    formItem,
    updateItem,
    serverItems,
    loadingTable,
    totalItems,
    search,
    searchInput,
    itemsPerPage,
    headers,
    currentTableOptions,
    maxOrder,
  };
};