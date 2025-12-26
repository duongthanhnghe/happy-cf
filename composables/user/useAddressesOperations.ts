import { type Reactive, type Ref, watch } from 'vue';
import { Loading } from '@/utils/global';
import { showConfirm, showSuccess, showWarning } from '@/utils/toast';
import type { AddressDTO, CreateAddressBody } from '@/server/types/dto/v1/address.dto';
import { addressesAPI } from '@/services/v1/addresses.service';

export const useAddressesOperations = (
  formDataItem: Reactive<CreateAddressBody>,
  dataList: Ref<AddressDTO[] | null>,
  detailData: Ref<AddressDTO | null>,
  isTogglePopupUpdate: Ref<boolean>,
  isTogglePopupAdd: Ref<boolean>,
  userId: string | null,
  storeLocation: any,
  loadItems: () => void,
  handleResetForm: () => void,
) => {

  async function submitCreate() {
    Loading(true);
    try {
      if(!userId) return
      formDataItem.userId = userId

      const newDataItem: CreateAddressBody = { ...formDataItem }
      const data = await addressesAPI.create(newDataItem)

      if (data.code === 0) {
        showSuccess(data.message)
        handleResetForm()
        loadItems()
        isTogglePopupAdd.value = false
      } else {
        showWarning(data.message)
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  async function submitUpdate() {
    Loading(true);
    try {
      if(!detailData.value) return
      const newDataItem: CreateAddressBody = { ...formDataItem }
      const data = await addressesAPI.update(detailData.value.id, newDataItem)

      if (data.code === 0) {
        showSuccess(data.message)
        isTogglePopupUpdate.value = false
        handleResetForm()
        loadItems()
      } else if (data.code === 1) {
        showWarning(data.message)
      } else {
        showWarning(data.message)
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

    if (formDataItem.isDefault) {
      showWarning('Không thể xoá địa chỉ mặc định')
      return
    }
    Loading(true);
    try {
      const data = await addressesAPI.delete(id)
      if (data.code === 0) {
        showSuccess(data.message)
        if (dataList.value) {
          dataList.value = dataList.value.filter(item => item.id !== id)
        }
        loadItems()
        isTogglePopupUpdate.value = false
      } else if (data.code === 1) {
        showWarning(data.message)
      } else {
        showWarning(data.message)
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  //set value location
  watch(() => storeLocation.selectedProvince,
    (newVal) => {
      if (newVal !== null) {
        formDataItem.provinceCode = newVal
      }
    }
  )

  watch(() => storeLocation.selectedDistrict,
    (newVal) => {
      if (newVal !== null) {
        formDataItem.districtCode = newVal
      }
    }
  )

  watch(() => storeLocation.selectedWard,
    (newVal) => {
      if (newVal !== null) {
        formDataItem.wardCode = newVal
      }
    }
  )

  return {
    submitCreate,
    submitUpdate,
    handleDelete,
  };
};