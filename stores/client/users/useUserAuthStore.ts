import { defineStore } from "pinia";
import { useAuthUtils } from "@/composables/user/useAuthUtils";
import { useAuthState } from "@/composables/user/useAuthState";
import { useAccountStore } from "./useAccountStore";

export const useUserAuthStore = defineStore("UserAuth", () => {

  const state = useAuthState();
  const storeAccount = useAccountStore()

  const utils = useAuthUtils(
    state.emailForgot,
    state.newPassword,
    state.newPasswordConfirm,
    state.formUserItem,
    state.formUserLoginItem,
    state.loadingAuth,
  );

  return {
    ...state,
    ...utils,
  };
});
