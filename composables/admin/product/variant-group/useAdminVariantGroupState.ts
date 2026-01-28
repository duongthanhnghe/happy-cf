import type { CreateVariantGroupDTO, UpdateVariantGroupDTO, VariantGroupDTO } from '@/server/types/dto/v1/product.dto';
import { reactive, ref } from 'vue';

export const useAdminVariantGroupState = () => {

  const dataList = ref<VariantGroupDTO[] | null>(null);
  const serverItems = ref<VariantGroupDTO[]>([])
  const totalItems = ref<number>(0)
  const loadingTable = ref<boolean>(true)

  const defaultForm: CreateVariantGroupDTO = {
    groupName: "",
    groupType: "",
    description: "",
    icon: "",
    isActive: true,
    hasImage: true,
    variants: []
  };

  const formItem = reactive<CreateVariantGroupDTO>({ ...defaultForm })
  const updateItem = reactive<UpdateVariantGroupDTO>({ ...defaultForm, id: '' })

  const detailData = ref<VariantGroupDTO | null>(null);
  const isTogglePopupAdd = ref<boolean>(false);
  const isTogglePopupUpdate = ref<boolean>(false);

  const itemsPerPage = 10;
  const search = ref<string>("");
  const searchInput = ref<string>("");
  const headers = ref([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Tên nhóm biến thể', key: 'groupName', sortable: false },
    { title: 'Loại', key: 'groupType', sortable: false },
    { title: 'Icon hiển thị', key: 'icon', sortable: false },
    { title: 'Mô tả', key: 'description', sortable: false },
    { title: 'Biến thể', key: 'variants', sortable: false },
    // { title: 'Ảnh biến thể', key: 'hasImage', sortable: false },
    { title: 'Trạng thái', key: 'isActive', sortable: false },
    { title: '', key: 'actions', sortable: false },
  ])

  const currentTableOptions = ref({
    page: 1,
    itemsPerPage: itemsPerPage,
    sortBy: [],
  })

  return {
    dataList,
    serverItems,
    loadingTable,
    totalItems,
    search,
    searchInput,
    itemsPerPage,
    headers,
    currentTableOptions,

    formItem,
    updateItem,
    defaultForm,
    detailData,

    isTogglePopupAdd,
    isTogglePopupUpdate,
  };
};