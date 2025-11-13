import { reactive, ref } from "vue";
import { ADDRESS_TAG } from "@/shared/constants/address-tag";
import type { AddressDTO, CreateAddressBody } from "@/server/types/dto/v1/address.dto";

export const useAddressesState = () => {
 
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
  const loadingData = ref(false);

  return {
    defaultForm,
    formDataItem,
    dataList,
    detailData,
    isTogglePopupList,
    isTogglePopupUpdate,
    isTogglePopupAdd,
    isChildrenPopupManage,
    actionChangeAddress,
    loadingData,
  };
};
