import { showWarning, showConfirm, showSuccess } from "@/utils/toast";
import { computed, unref, type Ref } from 'vue';
import { Loading } from "@/utils/global";
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
import { useChangeOrder } from "@/composables/utils/useChangeOrder";
import { bannersAPI } from "@/services/v1/admin/banner.service";
import type { BannerDTO, CreateBannerBody } from "@/server/types/dto/v1/banner.dto";
type MaybeRef<T> = T | Ref<T>;

export const useAdminBannerOperations = (
  defaultForm: object,
  formBannerItem: MaybeRef<CreateBannerBody>,
  serverItems: Ref<BannerDTO[]>,
  loadingTable: Ref<Boolean>,
  isTogglePopupAdd: Ref<boolean>,
  isTogglePopupUpdate: Ref<boolean>,
  detailData: Ref<BannerDTO | null>,
) => {

  const getListData = async () => {
    const data = await bannersAPI.getAll()
    if(data.code === 0) serverItems.value = data.data
  }
  
  async function loadItems () {
    loadingTable.value = true
    await getListData()
    if(!serverItems.value){
      loadingTable.value= false
      return
    }  
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

  async function submitCreate () {
    Loading(true);

    try {
      const payload = unref(formBannerItem)

      const data = await bannersAPI.create(payload)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupAdd.value = false;
        handleResetForm()
        await loadItems();
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
    const data = await bannersAPI.getDetail(id)
    detailData.value = data.data
    if(!detailData.value) return
    handleTogglePopupUpdate(true);
    Object.assign(formBannerItem, detailData.value);
  }

  async function submitUpdate() {
    if(!detailData.value) return
    const id = detailData.value.id
    if (!id) return
    Loading(true);

    try {
      const payload = unref(formBannerItem)

      const data = await bannersAPI.update(id, payload)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupUpdate.value = false;
        handleResetForm()
        await loadItems();
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
        showSuccess(data.message ?? '')
        await loadItems();
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const { toggleActive } = useToggleActiveStatus(bannersAPI.toggleActive, serverItems );

  const { handleChangeOrder } = useChangeOrder(bannersAPI.updateOrder, () => loadItems());

  const getListOrder = computed(() => {
    return Array.from({ length: serverItems.value?.length }, (_, i) => i + 1)
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
    handleResetForm,
    toggleActive,
    handleChangeOrder,
    getListOrder,
  };
};