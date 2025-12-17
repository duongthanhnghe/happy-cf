import { reactive, ref } from 'vue';
import type { TableHeaders, TableOpt } from "@/server/types";
import type { CreatePostNewsDTO, PostNewsDTO } from "@/server/types/dto/v1/news.dto";

export const useAdminPostNewsState = () => {

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
  const dataList = ref<PostNewsDTO[]| null>(null);
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Hình ảnh', key: 'image', sortable: false },
    { title: 'Tiêu đề', key: 'title', sortable: false },
    { title: 'Lượt xem', key: 'views', sortable: false },
    { title: 'Danh mục', key: 'categoryName', sortable: false },
    { title: 'Tình trạng', key: 'isActive', sortable: false },
    { title: '', key: 'actions', sortable: false },
  ])
  const serverItems = ref<PostNewsDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const totalItems = ref<number>(0)
  const search = ref<string>('')
  const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage: 20,
    sortBy: [],
  })
  const filterCategory = ref<string>('')
  const isTogglePopupUpdate = ref<boolean>(false);
  const detailData = ref<PostNewsDTO|null>(null);
  const isTogglePopupAdd = ref<boolean>(false);

  return {
    defaultForm,
    dataList,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    detailData,
    formPostItem,
    updatePostItem,
    serverItems,
    loadingTable,
    totalItems,
    search,
    headers,
    currentTableOptions,
    filterCategory,
  };
};