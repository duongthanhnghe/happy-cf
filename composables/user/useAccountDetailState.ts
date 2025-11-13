import { ref } from "vue";
import type { User, InformationMembershipLevels } from "@/server/types/dto/v1/user.dto";

export const useAccountDetailState = () => {
  const detailData = ref<User | null>(null);
  const isTogglePopupBarcode = ref<boolean>(false);
  const isTogglePopupMembershipInformation = ref(false);
  const informationMembershipLevel = ref<InformationMembershipLevels | null>(null);
  const token = useCookie<string | null>("token", { sameSite: "lax" });
  const userId = ref<string | null>(null);
  const lastVerifiedAt = ref<number>(0);
  const verifyCacheDuration = 15 * 60 * 1000; // 15 phút

  return {
    detailData,
    isTogglePopupBarcode,
    isTogglePopupMembershipInformation,
    informationMembershipLevel,
    token,
    userId,
    lastVerifiedAt,
    verifyCacheDuration,
  };
};
