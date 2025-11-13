import { computed } from "vue";
import { defineStore } from "pinia";
import { useAccountDetailUtils } from "@/composables/user/useAccountDetailUtils";
import { useAccountDetailState } from "@/composables/user/useAccountDetailState";

export const useAccountStore = defineStore("AccountStore", () => {

  const state = useAccountDetailState();
  const utils = useAccountDetailUtils(state);

  const getDetailValue = computed(() => state.detailData.value)
  const getUserId = computed(() => state.userId.value)
  const getInformationMembershipLevel = computed(() => state.informationMembershipLevel.value)

  return {
    ...state,
    ...utils,
    getDetailValue,
    getUserId,
    getInformationMembershipLevel,
  };
});
