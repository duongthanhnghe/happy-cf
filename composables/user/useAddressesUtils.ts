import { nextTick, type Reactive, type Ref } from 'vue';
import { Loading } from '@/utils/global';
import type { AddressDTO, CreateAddressBody } from '@/server/types/dto/v1/address.dto';
import { addressesAPI } from '@/services/v1/addresses.service';
import { useAddressAll } from '@/composables/user/useAddressAll'

export const useAddressesUtils = (
  defaultForm: CreateAddressBody,
  formDataItem: Reactive<CreateAddressBody>,
  dataList: Ref<AddressDTO[] | null>,
  detailData: Ref<AddressDTO | null>,
  isTogglePopupList: Ref<boolean>,
  isTogglePopupUpdate: Ref<boolean>,
  isTogglePopupAdd: Ref<boolean>,
  actionChangeAddress: Ref<boolean>,
  loadingData: Ref<boolean>,
  storeLocation: any,
) => {

  const { getListAddressAllApi, fetchAddressAll } = useAddressAll()  

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
    loadingData.value = true
    await fetchAddressAll()
    if (getListAddressAllApi.value?.length) {
      dataList.value = getListAddressAllApi.value
    }
    loadingData.value = false
  }

  const handleResetForm = () => {
    Object.assign(formDataItem, defaultForm)
    storeLocation.resetLocation()
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

  const getDefaultAddress = async () => {
    await fetchAddressAll()
    if (!getListAddressAllApi.value?.length) return
    try {
      return await addressesAPI.getDefaultAddressByUserId()
    } catch {
      return null
    }
  }

  return {
    handleTogglePopupList,
    handleTogglePopupAdd,
    handleTogglePopupUpdate,
    loadItems,
    handleResetForm,
    handleEdit,
    getDefaultAddress,
  };
};