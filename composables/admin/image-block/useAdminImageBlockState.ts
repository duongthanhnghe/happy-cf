import { reactive, ref } from 'vue';
import type { TableHeaders } from "@/server/types";
import type { CreateImageBlockBody, UpdateImageBlockBody, ImageBlockDTO } from '@/server/types/dto/v1/image-block.dto';
import { IMAGE_BLOCK_PAGES,
  IMAGE_BLOCK_POSITIONS, } from '@/shared/constants/image-block'

export const useAdminImageBlockState = () => {

  const defaultForm: CreateImageBlockBody = {
    title: '',
    description: '',
    image: '',
    isActive: false,
    textButton: '',
    linkRedirect: '',
    page: IMAGE_BLOCK_PAGES.HOME,
    position: IMAGE_BLOCK_POSITIONS.HERO,
  };
  const formItem = reactive<CreateImageBlockBody>({ ...defaultForm })
  const formUpdate = reactive<UpdateImageBlockBody>({ ...defaultForm })
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false, headerProps: { class: 'white-space min-width-90' }, cellProps: { class: 'white-space min-width-90' } },

    { title: 'Hình ảnh', key: 'image', sortable: false },
    { title: 'Tiêu đề', key: 'title', sortable: false },
    { title: 'Mô tả', key: 'description', sortable: false },

    { title: 'Text nút', key: 'textButton', sortable: false },
    { title: 'Link', key: 'linkRedirect', sortable: false },

    { title: 'Trang', key: 'page', sortable: false },
    { title: 'Vị trí', key: 'position', sortable: false },

    { title: 'Kích hoạt', key: 'isActive', sortable: false },
    { title: '', key: 'actions', sortable: false },
  ])
  const serverItems = ref<ImageBlockDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const isTogglePopupUpdate = ref<boolean>(false)
  const isTogglePopupAdd = ref<boolean>(false)
  const detailData = ref<ImageBlockDTO | null>(null)

  return {
    defaultForm,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    detailData,
    formItem,
    formUpdate,
    serverItems,
    loadingTable,
    headers,
  };
};