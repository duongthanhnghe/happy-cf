import { reactive, ref } from 'vue';
import type { TableHeaders, TableOpt } from "@/server/types";
import type { TranslationCreateDTO, TranslationDTO, TranslationUpdateDTO } from "@/server/types/dto/v1/itranslation.dto";

export const useAdminITranslationState = () => {

  const defaultForm: TranslationCreateDTO = {
    key: "",
    type: "text",
    translations: {
      vi: "",
      en: "",
    },
  };
  const formItem = reactive<TranslationCreateDTO>({ ...defaultForm });
  const updateItem = reactive<TranslationUpdateDTO & { id: string }>({
    ...defaultForm,
    id: "",
  });
  const dataList = ref<TranslationDTO[]>([]);
  const serverItems = ref<TranslationDTO[]>([]);
  const loadingTable = ref<boolean>(false);
  const totalItems = ref<number>(0);
  const detailData = ref<TranslationDTO | null>(null);
  const search = ref<string>("");
  const isTogglePopupAdd = ref<boolean>(false);
  const isTogglePopupUpdate = ref<boolean>(false);
  const itemsPerPage = 10;
  const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage,
    sortBy: [],
  });
  const headers = ref<TableHeaders[]>([
    { title: "Key", key: "key", sortable: false },
    { title: "Loại", key: "type", sortable: false },
    { title: "Nội dung", key: "translations", sortable: false },
    { title: "", key: "actions", sortable: false },
  ]);

  return {
    defaultForm,
    dataList,
    serverItems,
    headers,
    loadingTable,
    totalItems,
    itemsPerPage,
    currentTableOptions,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    formItem,
    updateItem,
    detailData,
    search,
  };
};