import { reactive, ref } from 'vue';
import type { TableHeaders } from "@/server/types";
import type { BannerDTO, CreateBannerBody } from "@/server/types/dto/v1/banner.dto";

export const useAdminBannerState = () => {

  const defaultForm: CreateBannerBody = {
    title: '',
    description: '',
    image: '',
    isActive: false,
  };
  const formBannerItem = reactive<CreateBannerBody>({ ...defaultForm })
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false, headerProps: { class: 'white-space min-width-90' }, cellProps: { class: 'white-space min-width-90' } },
    { title: 'Hình ảnh', key: 'image', sortable: false },
    { title: 'Tiêu đề', key: 'title', sortable: false },
    { title: 'Nội dung', key: 'description', sortable: false },
    { title: 'Kích hoạt', key: 'isActive', sortable: false },
    { title: '', key: 'actions', sortable: false },
  ])
  const serverItems = ref<BannerDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const isTogglePopupUpdate = ref<boolean>(false)
  const isTogglePopupAdd = ref<boolean>(false)
  const detailData = ref<BannerDTO | null>(null)

  return {
    defaultForm,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    detailData,
    formBannerItem,
    serverItems,
    loadingTable,
    headers,
  };
};