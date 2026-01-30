import { ref, reactive } from "vue";
import type { TableHeaders, TableOpt } from "@/server/types";
import type {
  FlashSaleDTO,
  CreateFlashSaleBody,
  FlashSalePaginationDTO,
} from "@/server/types/dto/v1/flash-sale.dto";

export const useFlashSaleManageState = () => {
  const defaultForm: CreateFlashSaleBody = {
    name: "",
    slug: "",
    description: "",
    startDate: "",
    endDate: "",
    priority: 0,
    isActive: true,
    banners: [],
    items: [],
    theme: {
      primaryColor: "",
      backgroundColor: "",
      textColor: "",
    },
    titleSEO: "",
    descriptionSEO: "",
    badgeImage: "",
    stackableWithVoucher: false,
    stackableWithPromotionGift: false,
  };

  const formItem = reactive<CreateFlashSaleBody>({ ...defaultForm });
  const updateItem = reactive<CreateFlashSaleBody>({ ...defaultForm });

  const dataList = ref<FlashSalePaginationDTO | null>(null);
  const serverItems = ref<FlashSaleDTO[]>([]);
  const loadingTable = ref(true);
  const totalItems = ref(0);

  const search = ref("");
  const searchInput = ref("");
  const fromDay = ref("");
  const toDay = ref("");

  const itemsPerPage = 20;

  const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage,
    sortBy: [],
  });

  const isTogglePopupAdd = ref(false);
  const isTogglePopupUpdate = ref(false);
  const detailData = ref<FlashSaleDTO | null>(null);
  const checkSelectImage = ref<boolean>(true)

  const headers = ref<TableHeaders[]>([
    { title: "STT", key: "index", sortable: false },
    { title: "Tên Flash Sale", key: "name", sortable: false },
    { title: "Ưu tiên", key: "priority", sortable: false },
    { title: "Thời gian", key: "dateRange", sortable: false },
    { title: 'Sản phẩm', key: 'items', sortable: false, headerProps: { class: 'white-space min-width-300' }, cellProps: { class: 'white-space min-width-300' } },
    { title: 'Áp dụng kèm', key: 'stackable', sortable: false },
    { title: "Trạng thái", key: "isActive", sortable: false },
    { title: "Badge image", key: "badgeImage", sortable: false },
    { title: "Banners", key: "banners", sortable: false, headerProps: { class: 'white-space min-width-300' }, cellProps: { class: 'white-space min-width-300' } },
    { title: 'Ngày tạo', key: 'createdAt', sortable: false },
    {
      title: "",
      key: "actions",
      sortable: false,
      headerProps: { class: "v-data-table-sticky-cl-right" },
      cellProps: { class: "v-data-table-sticky-cl-right" },
    },
  ]);

  return {
    defaultForm,
    formItem,
    updateItem,
    dataList,
    serverItems,
    loadingTable,
    totalItems,
    search,
    searchInput,
    fromDay,
    toDay,
    headers,
    currentTableOptions,
    itemsPerPage,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    detailData,
    checkSelectImage,
  };
};