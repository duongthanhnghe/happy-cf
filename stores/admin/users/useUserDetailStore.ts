import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useAdminUserDetail } from "@/composables/user/useAdminUserDetail";

export const useAdminUserDetailStore = defineStore("AdminUserDetail", () => {
  const { getDetailUserApi, fetchDetailUser } = useAdminUserDetail()

  const isTogglePopup = ref<boolean>(false);
  const handleTogglePopup = async (value: boolean, idUser: string) => {
    await fetchDetailUser(idUser)
    isTogglePopup.value = value;
  };
  
  const getDetailUser = computed(() => getDetailUserApi.value);
  
  return {
    isTogglePopup,
    handleTogglePopup,
    fetchDetailUser,
    getDetailUser,
  };
});
