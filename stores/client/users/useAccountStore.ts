import { computed } from "vue";
import { defineStore } from "pinia";
import { useAccountDetailUtils } from "@/composables/user/useAccountDetailUtils";
import { useAccountDetailState } from "@/composables/user/useAccountDetailState";
import { ROUTES } from "@/shared/constants/routes";
import { useITranslations } from "@/composables/shared/itranslation/useITranslations";

export const useAccountStore = defineStore("AccountStore", () => {

  const state = useAccountDetailState();
  const utils = useAccountDetailUtils(state);
  const { t } = useITranslations()

  const getDetailValue = computed(() => state.detailData.value)
  const getUserId = computed(() => state.userId.value)
  const getInformationMembershipLevel = computed(() => state.informationMembershipLevel.value)
  const hasWarningInfo = computed(() => {
    const d = state.detailData.value
    return !d?.phone || !d?.birthday
  })

  const accountMenuInfo = computed(() => {
    return [
      { label: t('page.pointclub.heading').text, path: `${ROUTES.PUBLIC.PAGE.children?.POINT_CLUB.path}?tab=1`, icon: 'groups', value: 1,},
      { label: t('membership.text1').text , path: `${ROUTES.PUBLIC.PAGE.children?.POINT_CLUB.path}?tab=2`, icon: 'paid', value: 2, },
      { label: t('membership.text2').text, path: `${ROUTES.PUBLIC.PAGE.children?.POINT_CLUB.path}?tab=3` , icon: 'crown', value: 3, },
      { label: t('membership.text3').text, path: `${ROUTES.PUBLIC.PAGE.children?.POINT_CLUB.path}?tab=4` , icon: 'percent_discount', value: 4, },
    ]
  })

  return {
    ...state,
    ...utils,
    getDetailValue,
    getUserId,
    getInformationMembershipLevel,
    accountMenuInfo,
    hasWarningInfo
  };
});
