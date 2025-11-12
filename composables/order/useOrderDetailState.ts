import { ref } from "vue";

export const useOrderDetailState = () => {
  
  const isTogglePopupDetail = ref(false)
  const idOrderPopupDetail = ref<string>('')
  const checkPageDetail = ref(false)

  return {
    isTogglePopupDetail,
    idOrderPopupDetail,
    checkPageDetail,
  };
};