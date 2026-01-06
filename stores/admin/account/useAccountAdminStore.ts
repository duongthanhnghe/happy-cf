import { computed } from "vue";
import { defineStore } from "pinia";
import { useAdminAccountOperations } from "@/composables/admin/account/useAdminAccountOperations";
import { useAdminAccountState } from "@/composables/admin/account/useAdminAccountState";

export const useAccountAdminStore = defineStore("AccountAdminStore", () => {

  const state = useAdminAccountState()

  const operations = useAdminAccountOperations(
    state.token,
    state.formLogin,
    state.formUpdate,
    state.oldPassword,
    state.newPassword,
    state.newPasswordConfirm,
    state.userId,
    state.detailData,
    state.lastVerifiedAt,
    state.verifyCacheDuration,
  )

  const getDetailAccount = computed(() => state.detailData.value)
  const getUserId = computed(() => state.userId.value)

  return {
    ...state,
    ...operations,
    getDetailAccount,
    getUserId,
  };
});
