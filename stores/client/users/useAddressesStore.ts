import { ref, reactive, computed, watch, nextTick } from "vue";
import { defineStore } from "pinia";
import { addressesAPI } from "@/services/v1/addresses.service";
import { Loading } from '@/utils/global'
import type { AddressDTO, CreateAddressBody } from '@/server/types/dto/v1/address.dto'
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { showConfirm, showSuccess, showWarning } from "@/utils/toast";
import { ADDRESS_TAG } from "@/shared/constants/address-tag";
import { useAddressAll } from '@/composables/user/useAddressAll'
import { useLocationStore } from '@/stores/shared/useLocationStore';

export const useAddressesManageStore = defineStore("AddressesManage", () => {
  const { getListAddressAllApi, fetchAddressAll } = useAddressAll()  
  const storeAccount = useAccountStore();
  const storeLocation = useLocationStore();

  const defaultForm: CreateAddressBody = {
    fullname: '',
    phone: '',
    address: '',
    note: '',
    tag: ADDRESS_TAG.HOME,
    isDefault: false,
    userId: '',
    provinceCode: 0,
    districtCode: 0,
    wardCode: 0,
  };
  const formDataItem = reactive<CreateAddressBody>({ ...defaultForm })
  const dataList = ref<AddressDTO[] | null>(null);
  const detailData = ref<AddressDTO | null>(null);
  const isTogglePopupList = ref(false);
  const isTogglePopupUpdate = ref(false);
  const isTogglePopupAdd = ref(false);
  const isChildrenPopupManage = ref(false);
  const actionChangeAddress = ref(false);

  // utils
  const handleTogglePopupList = (value: boolean, action: boolean) => {
    isTogglePopupList.value = value;
    actionChangeAddress.value = action
    if(!dataList.value) loadItems();
  };

  const handleTogglePopupAdd = async (value: boolean) => {
    handleResetForm()
    if(storeLocation.getListProvinces.length === 0) await storeLocation.fetchProvincesStore()
    isTogglePopupAdd.value = value;
  };

  const handleTogglePopupUpdate = async (value: boolean) => {
    if(storeLocation.getListProvinces.length === 0) await storeLocation.fetchProvincesStore()
    isTogglePopupUpdate.value = value;
  };

  async function loadItems() {
    const userId = storeAccount.getDetailValue?.id
    if (!userId) return
    await fetchAddressAll(userId)
    if (getListAddressAllApi.value?.length) {
      dataList.value = getListAddressAllApi.value
    }
  }

  const handleResetForm = () => {
    Object.assign(formDataItem, defaultForm)
    storeLocation.resetLocation()
  }

  //CRUD
  async function submitCreate() {
    Loading(true);
    try {
      if(!storeAccount.getDetailValue?.id) return
      formDataItem.userId = storeAccount.getDetailValue.id

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
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  const handleEdit = async (id: string) => {
    Loading(true);
    try {
      const data = await addressesAPI.getDetail(id)
      detailData.value = data.data
      if(!detailData.value) return
      
      await storeLocation.setLocationProgrammatically(
        detailData.value.provinceCode,
        detailData.value.districtCode,
        detailData.value.wardCode
      )
      
      Object.assign(formDataItem, detailData.value);
      await nextTick()
      handleTogglePopupUpdate(true);
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
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
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
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  //Get default
  const getDefaultAddress = async (userId: string) => {
    await fetchAddressAll(userId)
    if (!getListAddressAllApi.value?.length) return
    try {
      return await addressesAPI.getDefaultAddressByUserId(userId)
    } catch {
      return null
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

  // getters
  const getListAddress = computed(() => dataList.value);
  const getActionChangeAddress = computed(() => actionChangeAddress.value);

  return {
    formDataItem,
    dataList,
    detailData,
    isTogglePopupList,
    isTogglePopupUpdate,
    isTogglePopupAdd,
    isChildrenPopupManage,
    actionChangeAddress,

    loadItems,
    handleResetForm,
    submitCreate,
    handleEdit,
    submitUpdate,
    handleDelete,
    getDefaultAddress,
    handleTogglePopupList,
    handleTogglePopupAdd,
    handleTogglePopupUpdate,

    getListAddress,
    getActionChangeAddress,
  }
});