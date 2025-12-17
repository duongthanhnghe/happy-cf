import { showWarning, showConfirm, showSuccess } from "@/utils/toast";
import { computed, unref, type Ref } from 'vue';
import type { TableOpt } from "@/server/types";
import { Loading } from "@/utils/global";
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
import { useChangeOrder } from "@/composables/utils/useChangeOrder";
import { bannersAPI } from "@/services/v1/admin/banner.service";
import type { BannerDTO, CreateBannerBody } from "@/server/types/dto/v1/banner.dto";
import { watch } from "vue";
type MaybeRef<T> = T | Ref<T>;

export const useAdminBannerOperations = (
  defaultForm: object,
  formBannerItem: MaybeRef<CreateBannerBody>,
  dataList: Ref<BannerDTO[] | null>,
  serverItems: Ref<BannerDTO[]>,
  loadingTable: Ref<Boolean>,
  totalItems: Ref<number>,
  currentTableOptions: Ref<TableOpt>,
  isTogglePopupAdd: Ref<boolean>,
  isTogglePopupUpdate: Ref<boolean>,
  detailData: Ref<{ data: BannerDTO } | null| null>,
) => {

  const getListData = async () => {
    const data = await bannersAPI.getAll()
    if(data.code === 0) dataList.value = data.data
  }
  
  async function loadItems (opt: TableOpt) {
    loadingTable.value = true
    await getListData()
    if(!dataList.value){
      loadingTable.value= false
      return
    }  
    serverItems.value = dataList.value
    totalItems.value  = dataList.value?.length
    loadingTable.value= false
  }

  const handleTogglePopupAdd = (value:boolean) => {
    handleResetForm()
    isTogglePopupAdd.value = value;
  };

  const handleTogglePopupUpdate = (value:boolean) => {
    isTogglePopupUpdate.value = value;
  };

  const handleResetForm = () => {
    Object.assign(formBannerItem, defaultForm)
  }
  const handleReload = async () => {
    await loadItems(currentTableOptions.value);
  }

  async function submitCreate () {
    Loading(true);

    try {
      const newCategory = unref(formBannerItem)

      const data = await bannersAPI.create(newCategory)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupAdd.value = false;
        handleResetForm()
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleEdit = async (id: string) => {
    detailData.value = await bannersAPI.getDetail(id)
    if(!detailData.value) return
    handleTogglePopupUpdate(true);
    const data = detailData.value.data;
    Object.assign(formBannerItem, data);
  }

  async function submitUpdate() {
    if(!detailData.value) return
    const id = detailData.value.data?.id
    if (!id) return
    Loading(true);

    try {
      const newCategory = unref(formBannerItem)

      const data = await bannersAPI.update(id, newCategory)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupUpdate.value = false;
        handleResetForm()
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleDelete = async (id: string) => {
    const confirm = await showConfirm('Bạn có chắc xoá mục này?')
    if (!confirm) return

    Loading(true);
    try {
      const data = await bannersAPI.delete(id)
      if(data.code === 0){
        showSuccess(data.message)
        handleReload()
      } else {
        showWarning(data.message)
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  watch(
    () => ({
      page: currentTableOptions.value.page,
      limit: currentTableOptions.value.itemsPerPage,
    }),
    () => {
      loadItems(currentTableOptions.value);
    },
    { deep: true }
  )

  const { toggleActive } = useToggleActiveStatus(bannersAPI.toggleActive, serverItems );

  const { handleChangeOrder } = useChangeOrder(bannersAPI.updateOrder, () => loadItems(currentTableOptions.value));

  const getListOrder = computed(() => {
    return Array.from({ length: totalItems.value }, (_, i) => i + 1)
  })

  return {
    handleTogglePopupAdd,
    handleTogglePopupUpdate,
    handleEdit,
    handleDelete,
    getListData,
    loadItems,
    submitCreate,
    submitUpdate,
    handleReload,
    handleResetForm,
    toggleActive,
    handleChangeOrder,
    getListOrder,
  };
};