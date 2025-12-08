import { ref, reactive, watch, computed } from "vue";
import { defineStore } from "pinia";
import { iTranslationAPI } from "@/services/v1/admin/itranslation.service";
import { Loading, debounce} from '@/utils/global';
import { showSuccess, showWarning, showConfirm } from "@/utils/toast";
import type { 
  TranslationDTO,
  TranslationCreateDTO,
  TranslationUpdateDTO
} from "@/server/types/dto/v1/itranslation.dto";
import type { TableOpt, TableHeaders } from "@/server/types/dto/v1/table-vuetify.dto";
import { useAdminITranslationDetail } from "@/composables/itranslation/useAdminITranslationDetail";
import { useAdminITranslationAll } from "@/composables/shared/itranslation/useAdminITranslationAll";
import { FOLDER_UPLOAD } from "@/shared/constants/folder-upload";

export const useTranslationManageStore = defineStore("TranslationManageStore", () => {

  const { getITranslationDetail, fetchITranslationDetail } = useAdminITranslationDetail()
  const { getListITranslation, fetchListITranslationAll } = useAdminITranslationAll()

  const folderName = FOLDER_UPLOAD.DEFAULT
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
  const searchName = ref<string>("");
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
    { title: "Type", key: "type", sortable: false },
    { title: "Noi dung", key: "translations", sortable: false },
    { title: "", key: "actions", sortable: false },
  ]);

  const getListAll = async () => {
    await fetchListITranslationAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage, searchName.value)
   
    if(!getListITranslation.value) return
    dataList.value = getListITranslation.value.data
    totalItems.value = getListITranslation.value.pagination.total
    currentTableOptions.value.page = getListITranslation.value.pagination.page
    currentTableOptions.value.itemsPerPage = getListITranslation.value.pagination.limit
  }

  const handleTogglePopupAdd = (value: boolean) => {
    handleResetForm();
    updateItem.id = "";
    isTogglePopupAdd.value = value;
  };

  const handleTogglePopupUpdate = (value: boolean) => {
    isTogglePopupUpdate.value = value;
  };

  const handleResetForm = () => {
    Object.assign(formItem, defaultForm);
    Object.assign(updateItem, { ...defaultForm, id: "" });
  };

  const ListAllTranslationAPI = {
    async fetch({ page, itemsPerPage }: {
      page: TableOpt["page"],
      itemsPerPage: TableOpt["itemsPerPage"],
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          const items = dataList.value

          const start = (page - 1) * itemsPerPage;
          const paginated = items.slice(start, start + itemsPerPage);

          resolve({ items: paginated, total: items.length });
        }, 300);
      });
    },
  };

  async function loadItems(opts: TableOpt) {
    loadingTable.value = true;

    await getListAll()

    const { items, total } = await ListAllTranslationAPI.fetch({
      page: opts.page,
      itemsPerPage: opts.itemsPerPage,
    }) as { items: TranslationDTO[], total: number };

    serverItems.value = items;
    if(getListITranslation.value) totalItems.value = getListITranslation.value.pagination.total

    totalItems.value = total;
    loadingTable.value = false;
  }

  const debouncedFetch = debounce(() => loadItems(currentTableOptions.value), 500)

  watch(searchName, () => {
    debouncedFetch()
  })

  async function submitCreate() {
    Loading(true);
    try {
      const data = await iTranslationAPI.createTranslation({ ...formItem });

      if (data.code === 0) {
        showSuccess(data.message ?? 'Thêm thành công');
        isTogglePopupAdd.value = false;
        handleResetForm();
        loadItems(currentTableOptions.value);
      } else showWarning(data.message ?? '');

      Loading(false);
    } catch (err) {
      console.error("Error create translation:", err);
      Loading(false);
    }
  }

  async function handleEdit(id: string) {
    if (!id) return;

    await fetchITranslationDetail(id)
    if(getITranslationDetail.value) detailData.value = getITranslationDetail.value
    if(!detailData.value) return

    Object.assign(updateItem, detailData.value);
    handleTogglePopupUpdate(true);
  }

  async function submitUpdate() {
    Loading(true);
    try {
      const data = await iTranslationAPI.updateTranslation(updateItem.id, {
        type: updateItem.type,
        translations: updateItem.translations,
      });

      if (data.code === 0) {
        showSuccess(data.message ?? 'Sửa thành công');
        isTogglePopupUpdate.value = false;
        handleResetForm();
        loadItems(currentTableOptions.value);
      } else showWarning(data.message ?? '');

      Loading(false);
    } catch (err) {
      console.error("Error update translation:", err);
      Loading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirm = await showConfirm("Bạn có chắc muốn xoá?");
    if (!confirm) return;

    Loading(true);

    try {
      const data = await iTranslationAPI.deleteTranslation(id);

      if (data.code === 0) {
        showSuccess(data.message);
        dataList.value = dataList.value.filter(item => item.id !== id);
        loadItems(currentTableOptions.value);
      } else showWarning(data.message);

      Loading(false);
    } catch (err) {
      console.error(`Error deleting translation ${id}`, err);
      Loading(false);
    }
  }

  return {
    // state
    dataList,
    serverItems,
    headers,
    loadingTable,
    totalItems,
    searchName,
    itemsPerPage,
    currentTableOptions,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    formItem,
    updateItem,
    folderName,

    // actions
    loadItems,
    submitCreate,
    submitUpdate,
    handleEdit,
    handleDelete,
    handleTogglePopupAdd,
    handleTogglePopupUpdate,
    handleResetForm,
  };
});
