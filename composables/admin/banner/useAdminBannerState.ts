import { reactive, ref } from 'vue';
import type { TableHeaders, TableOpt } from "@/server/types";
import type { BannerDTO, CreateBannerBody } from "@/server/types/dto/v1/banner.dto";

export const useAdminBannerState = () => {

  const defaultForm: CreateBannerBody = {
    title: '',
    description: '',
    image: '',
    isActive: false,
  };
  const formBannerItem = reactive<CreateBannerBody>({ ...defaultForm })
  const dataList = ref<BannerDTO[] | null>(null)
  const itemsPerPage = 10
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Hình ảnh', key: 'image', sortable: false },
    { title: 'Tiêu đề', key: 'title', sortable: false },
    { title: 'Nội dung', key: 'description', sortable: false },
    { title: 'Kích hoạt', key: 'isActive', sortable: false },
    { title: '', key: 'actions', sortable: false },
  ])
  const serverItems = ref<BannerDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const totalItems = ref<number>(0)
  const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage: 20,
    sortBy: [],
  })
  const isTogglePopupUpdate = ref<boolean>(false)
  const detailData = ref<{ data: BannerDTO } | null>(null)
  const isTogglePopupAdd = ref<boolean>(false)

  return {
    defaultForm,
    dataList,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    detailData,
    formBannerItem,
    serverItems,
    loadingTable,
    totalItems,
    itemsPerPage,
    headers,
    currentTableOptions,
  };
};