import { showWarning, showConfirm, showSuccess } from "@/utils/toast";
import { computed, unref, type Ref } from 'vue';
import { Loading } from "@/utils/global";
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
import { useChangeOrder } from "@/composables/utils/useChangeOrder";
import { imageBlocksAPI } from "@/services/v1/admin/image-block.service";
import type { CreateImageBlockBody, UpdateImageBlockBody, ImageBlockDTO } from '@/server/types/dto/v1/image-block.dto';
type MaybeRef<T> = T | Ref<T>;

export const useAdminImageBlockOperations = (
  defaultForm: object,
  formItem: MaybeRef<CreateImageBlockBody>,
  formUpdate: MaybeRef<UpdateImageBlockBody>,
  serverItems: Ref<ImageBlockDTO[]>,
  loadingTable: Ref<Boolean>,
  isTogglePopupAdd: Ref<boolean>,
  isTogglePopupUpdate: Ref<boolean>,
  detailData: Ref<ImageBlockDTO | null>,
) => {

  const getListData = async () => {
    const data = await imageBlocksAPI.getAll()
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
    Object.assign(unref(formItem), defaultForm)
  }

  async function submitCreate () {
    Loading(true);

    try {
      const payload = unref(formItem)

      const data = await imageBlocksAPI.create(payload)
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
    const data = await imageBlocksAPI.getDetail(id)
    if (!data?.data) return

    detailData.value = data.data
    Object.assign(unref(formUpdate), data.data)

    isTogglePopupUpdate.value = true
  }

  async function submitUpdate() {
    if(!detailData.value) return
    const id = detailData.value.id
    if (!id) return
    Loading(true);

    try {
      const payload = unref(formUpdate)

      const data = await imageBlocksAPI.update(id, payload)
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
      const data = await imageBlocksAPI.delete(id)
      if(data.code === 0){
        showSuccess(data.message)
        await loadItems();
      } else {
        showWarning(data.message)
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const { toggleActive } = useToggleActiveStatus(imageBlocksAPI.toggleActive, serverItems );

  const { handleChangeOrder } = useChangeOrder(imageBlocksAPI.updateOrder, () => loadItems());

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