import { reactive, ref } from 'vue';
import type { TableHeaders, TableOpt } from "@/server/types";
import type { AboutDTO, CreateAboutBody } from '@/server/types/dto/v1/about.dto';

export const useAdminAboutState = () => {

  const defaultForm: CreateAboutBody = {
    title: '', description: '', summaryContent: '', image: '', isActive: false, listImage: [],
  };
  const formItem = reactive<CreateAboutBody>({ ...defaultForm })
  const dataList = ref<AboutDTO[] | null>(null)
  const itemsPerPage = 10
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Hình ảnh', key: 'image', sortable: false },
    { title: 'Tiêu đề', key: 'title', sortable: false },
    { title: 'Mô tả', key: 'summaryContent', sortable: false },
    { title: 'Kích hoạt', key: 'isActive', sortable: false },
    { title: '', key: 'actions', sortable: false },
  ])
  const serverItems = ref<AboutDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const totalItems = ref<number>(0)
  const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage: 20,
    sortBy: [],
  })
  const isTogglePopupUpdate = ref<boolean>(false)
  const detailData = ref<{ data: AboutDTO } | null>(null)
  const isTogglePopupAdd = ref<boolean>(false)
  const checkSelectImage = ref<boolean>(true)

  return {
    defaultForm,
    dataList,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    detailData,
    formItem,
    serverItems,
    loadingTable,
    totalItems,
    itemsPerPage,
    headers,
    currentTableOptions,
    checkSelectImage,
  };
};