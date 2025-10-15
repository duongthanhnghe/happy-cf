import { watch, reactive } from "vue"
import { defineStore } from "pinia"
import { useSettingStore } from '@/stores/shared/setting/useSettingStore';
import { settingAPI } from "@/services/v1/setting.service";
import { Loading} from '@/utils/global'
import { showSuccess, showWarning } from "@/utils/toast";
import { useLocationStore } from '@/stores/shared/useLocationStore';

export const useSettingUpdateStore = defineStore("SettingUpdateStore", () => {
  const storeSetting = useSettingStore();
  const storeLocation = useLocationStore();

  const formItem = reactive<any>({});

  const handleInitStore = () => {
    if (!storeSetting.getSettings) return false;
    Object.assign(formItem, storeSetting.getSettings);

    storeLocation.selectedProvince = formItem.provinceCode ?? null;
    storeLocation.selectedDistrict = formItem.districtCode ?? null;
    storeLocation.selectedWard = formItem.wardCode ?? null;
  }

  const updateSetting = async () => {
    Loading(true);
    try {
      const data = await settingAPI.updateSettings(formItem)
      if(data.code == 0){
        showSuccess(data.message ?? '')
        localStorage.setItem("SettingStore", JSON.stringify(data.data))
      } else {
        showWarning(data.message ?? '')
      }
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  watch(() => storeSetting.getSettings, (newValue) => {
    if (newValue) {
      handleInitStore();
    }
  }, { 
    immediate: true,
    deep: true
  });

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
    handleInitStore,
    updateSetting,
  }
})