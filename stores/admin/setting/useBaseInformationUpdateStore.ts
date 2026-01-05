import { watch, reactive } from "vue"
import { defineStore } from "pinia"
import { useBaseInformationStore } from '@/stores/shared/setting/useBaseInformationStore';
import { baseInformationAPI } from "@/services/v1/shared/base-information.service"
import { Loading} from '@/utils/global'
import { showSuccess, showWarning } from "@/utils/toast";
import { useLocationStore } from '@/stores/shared/useLocationStore';
import type { UpdateBaseInformationBody } from "@/server/types/dto/v1/base-information.dto";

export const useBaseInformationUpdateStore = defineStore("BaseInformationUpdateStore", () => {
  const storeSetting = useBaseInformationStore();
  const storeLocation = useLocationStore();

  const formItem = reactive<UpdateBaseInformationBody>({
    name: "",
    logoUrl: "",
    phone: "",
    email: "",
    address: "",
    openingHours: "",
    socialLinks: [],
    description: "",
    provinceCode: 0,
    districtCode: 0,
    wardCode: 0,
  });

  const update = async () => {
    Loading(true);
    try {
      const data = await baseInformationAPI.updateBaseInformation(formItem)
      if(data.code == 0){
        showSuccess(data.message ?? '')
        localStorage.setItem("BaseInformationStore", JSON.stringify(data.data))
      } else {
        showWarning(data.message ?? '')
      }
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  const fetchInit = async () => {
    await storeSetting.fetchBaseInformation(true)

    if (!storeSetting.detailData) return

    Object.assign(formItem, storeSetting.detailData)

    storeLocation.selectedProvince = formItem.provinceCode ?? null
    storeLocation.selectedDistrict = formItem.districtCode ?? null
    storeLocation.selectedWard = formItem.wardCode ?? null
  }

  // watch(() => storeSetting.getBaseInformation, async (newValue) => {
  //   if (newValue) {
  //     handleInitStore();
  //   }
  // }, { 
  //   // immediate: true,
  //   deep: true
  // });

  //set value location
  watch(() => storeLocation.selectedProvince,
    (newVal) => {
      if (newVal !== null) {
        formItem.provinceCode = newVal
      }
    }
  )

  watch(() => storeLocation.selectedDistrict,
    (newVal) => {
      if (newVal !== null) {
        formItem.districtCode = newVal
      }
    }
  )

  watch(() => storeLocation.selectedWard,
    (newVal) => {
      if (newVal !== null) {
        formItem.wardCode = newVal
      }
    }
  )

  return {
    formItem,
    update,
    fetchInit,
  }
})