import { ref, reactive, computed, watch } from "vue";
import { defineStore } from "pinia";
import { addressesAPI } from "@/services/addresses.service";
import {
  Loading
} from '@/utils/global'
import type { AddressDTO, CreateAddressBody } from '@/server/types/dto/address.dto'
import {
  useAccountStore
} from '@/stores/client/users/useAccountStore'
import { showConfirm, showSuccess, showWarning } from "@/utils/toast";
import { ADDRESS_TAG } from "@/shared/constants/address-tag";
import { useAddressAll  } from '@/composables/user/useAddressAll'

export const useAddressesManageStore = defineStore("AddressesManage", () => {

const { getListAddressAllApi, fetchAddressAll } = useAddressAll()  
const storeAccount = useAccountStore();

//state global  
const valid = ref<boolean>(false)
const titleRules = [
  (value:string) => {
    if (value) return true
    return 'Noi dung khong duoc trong'
  },
  (value:string) => {
    if (value?.length <= 100) return true
    return 'Noi dung khong duoc qua 100 ky tu'
  },
]

const formDataItem = reactive<CreateAddressBody>({
  fullname: '',
  phone: '',
  address: '',
  note: '',
  tag: ADDRESS_TAG.HOME,
  isDefault: false,
  userId: '',
});

const dataList = ref<AddressDTO[] | null>(null);
const isTogglePopupList = ref<boolean>(false);
const actionChangeAddress = ref<boolean>(false)
const isTogglePopupUpdate = ref<boolean>(false);
const detailData = ref<AddressDTO | null>(null);
const isTogglePopupAdd = ref<boolean>(false);
const isChildrenPopupManage = ref<boolean>(false);

//actions list
  async function loadItems() {
    const userId = storeAccount.getDetailValue?.id
    if(!userId) return
    await fetchAddressAll(userId)
    if(getListAddressAllApi.value && getListAddressAllApi.value.length > 0) dataList.value = getListAddressAllApi.value
  }

  watch(dataList, (newVal) => {
    dataList.value = newVal;
  })

  //actions global
  const handleTogglePopupList = (value: boolean, action: boolean, popupChildren: boolean) => {
    isTogglePopupList.value = value;
    actionChangeAddress.value = action
    isChildrenPopupManage.value = popupChildren
    if(!dataList.value) loadItems();
  };

  const handleTogglePopupAdd = (value: boolean) => {
    isTogglePopupAdd.value = value;
  };

  const handleTogglePopupUpdate = (value: boolean) => {
    isTogglePopupUpdate.value = value;
  };

  const handleResetForm = () => {
    formDataItem.fullname = ''
    formDataItem.phone = ''
    formDataItem.address = ''
    formDataItem.note = ''
    formDataItem.tag = ADDRESS_TAG.HOME
    formDataItem.isDefault = false
    formDataItem.userId = ''
  }

  //actions add
  async function submitCreate() {
    Loading(true);
    try {
      if(!storeAccount.getDetailValue?.id) return
      formDataItem.userId = storeAccount.getDetailValue?.id;

      const newDataItem = {...formDataItem}

      const data = await addressesAPI.create(newDataItem)
      if(data.code === 0){
        showSuccess('Tao thanh cong')
        isTogglePopupAdd.value = false;
        handleResetForm()
        loadItems();
      } else {
        showWarning('Tao that bai')
      }
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
    }
    Loading(false);
  }

  //actions edit
  const handleEdit = async (id: string) => {
    const data = await addressesAPI.getDetail(id)
    detailData.value = data.data
    if(!detailData.value) return
    handleTogglePopupUpdate(true);
    Object.assign(formDataItem, detailData.value);
  }

  async function submitUpdate() {
    Loading(true);
    try {
      if(!detailData.value) return
      const newDataItem = {...formDataItem}
      const data = await addressesAPI.update(detailData.value.id, newDataItem)
      if(data.code === 0){
        showSuccess('Cap nhat thanh cong')
        isTogglePopupUpdate.value = false;
        handleResetForm()
        loadItems();
      } else if (data.code === 1){
        showWarning('Dia chi không tồn tại')
      } else {
        showWarning('Cap nhat that bai')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    }
    Loading(false);
  }

  //actions delete
  const handleDelete = async (id: string) => {
    const confirm = await showConfirm('Bạn có chắc xoá mục này?')
    if (!confirm) return

    if(formDataItem.isDefault){
      showWarning('Khong the xoa dia chi mac dinh')
      return
    } else {
      Loading(true);
      try {
        const data = await addressesAPI.delete(id)
        if(data.code === 0){
          showSuccess('Xoa thanh cong')
          if(dataList.value){
            dataList.value = dataList.value.filter(item => 
              item.id !== id
            )
          }
          loadItems();
          handleTogglePopupUpdate(false);
        } else if (data.code === 1){
          showWarning('Dia chi không tồn tại')
        } else {
          showWarning('Xoa that bai')
        }
        Loading(false);
      } catch (err) {
        console.error('Error submitting form:', err)
        Loading(false);
      }
    }
  }

  const getDefaultAddress = async (userId: string) => {
    await fetchAddressAll(userId)
    
    if(!getListAddressAllApi.value || getListAddressAllApi.value.length === 0) return

    try {
      const data = await addressesAPI.getDefaultAddressByUserId(userId)
      if(!data) return
      return data
    } catch (err) {
      return null
    }
  }

  //getters
  const getListAddress = computed(() => dataList.value);
  const getActionChangeAddress = computed(() => actionChangeAddress.value);

  return {
    // state
    valid,
    dataList,
    isTogglePopupList,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    titleRules,
    detailData,
    formDataItem,
    actionChangeAddress,
    isChildrenPopupManage,
    // actions
    handleTogglePopupList,
    handleTogglePopupAdd,
    handleTogglePopupUpdate,
    handleEdit,
    handleDelete,
    loadItems,
    submitCreate,
    submitUpdate,
    handleResetForm,
    getDefaultAddress,
    //getters
    getListAddress,
    getActionChangeAddress,
  };
});
