import { defineStore } from "pinia";
import { useAuthUtils } from "@/composables/user/useAuthUtils";
import { useAuthState } from "@/composables/user/useAuthState";

export const useUserAuthStore = defineStore("UserAuth", () => {

  const state = useAuthState();

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
