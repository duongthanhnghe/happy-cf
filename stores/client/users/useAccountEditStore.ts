import { computed } from "vue";
import { defineStore } from "pinia";
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { useAccountEditState } from "@/composables/user/useAccountEditState";
import { useAccountEditUtils } from "@/composables/user/useAccountEditUtils";

export const useAccountEditStore = defineStore("useAccountEdit", () => {
  const accountStore = useAccountStore()

  const state = useAccountEditState()

  const utils = useAccountEditUtils({
    isTogglePopupUpdate: state.isTogglePopupUpdate,
    formUserItem: state.formUserItem,
    oldPassword: state.oldPassword,
    newPassword: state.newPassword,
    newPasswordConfirm: state.newPasswordConfirm,
    isTogglePopupChangePassword: state.isTogglePopupChangePassword,
    accountStore,
  });

  const newPasswordRules = computed(() => utils.createNewPasswordRules(state.newPasswordConfirm.value))

  const getBirthday = computed({
    get: () => {
      if (!state.formUserItem.birthday) return ''
      return new Date(state.formUserItem.birthday).toISOString().split("T")[0]
    },
    set: (val: string) => { state.formUserItem.birthday = val }
  })

  return {
    ...state,
    ...utils,
    getBirthday,
    newPasswordRules,
  };
});

