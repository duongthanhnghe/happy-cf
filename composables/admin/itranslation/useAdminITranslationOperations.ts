import { showWarning, showConfirm, showSuccess } from "@/utils/toast";
import { unref, watch, type Ref } from 'vue';
import type { TableOpt } from "@/server/types";
import { Loading } from "@/utils/global";
import { iTranslationAPI } from "@/services/v1/admin/itranslation.service";
import { useAdminITranslationDetail } from "@/composables/itranslation/useAdminITranslationDetail";
import { useAdminITranslationAll } from "@/composables/admin/itranslation/useAdminITranslationAll";
import type { TranslationCreateDTO, TranslationDTO, TranslationUpdateDTO } from "@/server/types/dto/v1/itranslation.dto";
type MaybeRef<T> = T | Ref<T>;

export const useAdminITranslationOperations = (
  defaultForm: object,
  formItem: MaybeRef<TranslationCreateDTO>,
  updateItem: MaybeRef<TranslationUpdateDTO & { id: string }>,
  dataList: Ref<TranslationDTO[] | null>,
  serverItems: Ref<TranslationDTO[]>,
  loadingTable: Ref<Boolean>,
  totalItems: Ref<number>,
  search: Ref<string>,
  currentTableOptions: Ref<TableOpt>,
  isTogglePopupAdd: Ref<boolean>,
  isTogglePopupUpdate: Ref<boolean>,
  detailData: Ref<TranslationDTO | null>,
) => {

  const { getITranslationDetail, fetchITranslationDetail } = useAdminITranslationDetail()
  const { getListITranslation, fetchListITranslationAll } = useAdminITranslationAll()

  const getListAll = async () => {
    await fetchListITranslationAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage, search.value)
   
    if(!getListITranslation.value) return
    dataList.value = getListITranslation.value.data
    totalItems.value = getListITranslation.value.pagination.total
    currentTableOptions.value.page = getListITranslation.value.pagination.page
    currentTableOptions.value.itemsPerPage = getListITranslation.value.pagination.limit
  }

  const handleTogglePopupAdd = (value: boolean) => {
    handleResetForm();
    unref(updateItem).id = "";
    isTogglePopupAdd.value = value;
  };

  const handleTogglePopupUpdate = (value: boolean) => {
    isTogglePopupUpdate.value = value;
  };

  const getDefaultFormValues = () => ({
    key: "",
    type: "text" as const,
    translations: { vi: "", en: "" },
  });

  const handleResetForm = () => {
    Object.assign(formItem, getDefaultFormValues());
    Object.assign(updateItem, { ...getDefaultFormValues(), id: "" });
  };

  const ListAllTranslationAPI = {
    async fetch({ items}: {
      items: TranslationDTO[],
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()

          resolve({ items: filtered })
        }, 300)
      })
    },
  }

  async function loadItems(opts: TableOpt) {
    loadingTable.value = true;

    await getListAll()

    const { items } = await ListAllTranslationAPI.fetch({
      items: dataList.value || [],
    }) as { items: TranslationDTO[]};

    serverItems.value = items;
    if(getListITranslation.value) totalItems.value = getListITranslation.value.pagination.total

    loadingTable.value = false;
  }

  watch(
    () => ({
      search: search.value,
      page: currentTableOptions.value.page,
      limit: currentTableOptions.value.itemsPerPage,
    }),
    () => {
      loadItems(currentTableOptions.value)
    },
    { deep: true }
  )

  async function submitCreate() {
    Loading(true);
    try {
      const newData = unref(formItem)

      const data = await iTranslationAPI.createTranslation(newData);

      if (data.code === 0) {
        showSuccess(data.message ?? 'Thêm thành công');
        isTogglePopupAdd.value = false;
        handleResetForm();
        if (data.data) {
          serverItems.value.unshift(data.data);
          dataList.value?.unshift(data.data);
          totalItems.value = totalItems.value + 1;
        }
        // loadItems(currentTableOptions.value);
      } else if (data.code === 1) showWarning(data.message ?? '');
      else showWarning(data.message ?? '');
    } catch (err) {
      console.error("Error create translation:", err);
    } finally {
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
    const payload = unref(updateItem);
    
    try {
      const data = await iTranslationAPI.updateTranslation(payload.id!, {
        type: payload.type,
        translations: payload.translations,
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
        loadItems(currentTableOptions.value);
      } else showWarning(data.message);
    } catch (err) {
      console.error(`Error deleting translation ${id}`, err);
    } finally {
      Loading(false);
    }
  }

  return {
    loadItems,
    submitCreate,
    submitUpdate,
    handleEdit,
    handleDelete,
    handleTogglePopupAdd,
    handleTogglePopupUpdate,
    handleResetForm,
  };
};