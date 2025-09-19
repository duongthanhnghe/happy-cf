import { watch, reactive } from "vue"
import { defineStore } from "pinia"
import { useSettingStore } from '@/stores/shared/setting/useSettingStore';
import { settingAPI } from "@/services/setting.service";
import { Loading} from '@/utils/global'
import { showSuccess, showWarning } from "@/utils/toast";

export const useSettingUpdateStore = defineStore("SettingUpdateStore", () => {
  const storeSetting = useSettingStore();

  const contentRules = [
    (v: string) => !!v && v.replace(/<[^>]*>/g, '').trim().length > 0 || 'Nội dung không được để trống'
  ]

  const emailRules = [
    (value: string) => !!value || 'Email không được để trống',
    (value: string) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailPattern.test(value) || 'Email không hợp lệ'
    }
  ]

  const formItem = reactive<any>({});

  const handleInitStore = () => {
    if (!storeSetting.getSettings) return false;
    Object.assign(formItem, storeSetting.getSettings);
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

  return {
    formItem,
    contentRules,
    emailRules,
    handleInitStore,
    updateSetting,
  }
})