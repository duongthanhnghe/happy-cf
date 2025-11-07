import { ref, computed } from "vue";
import { useRouter } from 'vue-router'
import { defineStore } from "pinia";
import { authAPI } from "@/services/v1/auth.service";
import { ROUTES } from '@/shared/constants/routes';
import type { User, InformationMembershipLevels, MembershipLevels } from '@/server/types/dto/v1/user.dto'

export const useAccountStore = defineStore("AccountStore", () => {

  const router = useRouter()
  const token = useCookie<string | null>("token", { sameSite: "lax" });
  const isTogglePopupBarcode = ref<boolean>(false);
  const isTogglePopupMembershipInformation = ref<boolean>(false);
  const informationMembershipLevel = ref<InformationMembershipLevels|null>(null);
  const detailData = ref<User|null>(null)
  const userId = ref<string|null>(null)
  const loading = ref(false)
  const lastVerifiedAt = ref<number>(0)
  const verifyCacheDuration = 15 * 60 * 1000 // 15 phút

  const handleGetDetailAccount = async (userId: string) => {
    if(!userId) return
    const data = await authAPI.getDetailAccount(userId)
    detailData.value = data.data;
  };

  const handleTogglePopupBarcode = (value: boolean) => {
    if(isTogglePopupBarcode.value) return
    isTogglePopupBarcode.value = value;
  }

  const handleTogglePopupMembershipInformation = (value: boolean) => {
    isTogglePopupMembershipInformation.value = value;
  }

  const handleNextMembershipLevel = (currentPoint: number, membershipLevels: MembershipLevels[]) => {
    if (!membershipLevels || membershipLevels.length === 0) {
      return null
    }

    const sortedLevels = [...membershipLevels].sort((a, b) => a.minPoint - b.minPoint)
    
    let currentLevel = sortedLevels[0]
    let currentIndex = 0

    for (let i = sortedLevels.length - 1; i >= 0; i--) {
      if (currentPoint >= sortedLevels[i].minPoint) {
        currentLevel = sortedLevels[i]
        currentIndex = i
        break
      }
    }

    const nextLevel = currentIndex < sortedLevels.length - 1
      ? sortedLevels[currentIndex + 1]
      : currentLevel

    return {
      currentLevel,
      nextLevel
    }
  }

  const getNextMembershipLevel = (getMembershipList: MembershipLevels[]) => {
    if(!detailData.value || !getMembershipList) return
    const data = handleNextMembershipLevel(detailData.value.membership.point,getMembershipList)
    return informationMembershipLevel.value = data
  }

  const handleLogout = () => {
    const tokenCookie = useCookie<string | null>('token')  
    tokenCookie.value = null

    token.value = null
    detailData.value = null
    userId.value = null
    router.push({ path: ROUTES.PUBLIC.HOME.path })
  }

  async function verifyToken(force = false): Promise<null|boolean> {
    try {
      if (!token.value) return false

      const now = Date.now()
      
      if (!force && detailData.value && now - lastVerifiedAt.value < verifyCacheDuration) {
        return true
      }

      const res = await authAPI.verifyToken()

      if (res.code === 0 && res.data) {
        lastVerifiedAt.value = now
        await handleGetDetailAccount(res.data.id);
        userId.value = res.data.id;
        return true
      }

      console.warn("verifyToken failed:", res.message)
      return false
    } catch (err: any) {
      console.error("verifyToken error:", err)
      return null
    }
  }

  const getDetailValue = computed(() => detailData.value)
  const getLoading = computed(() => loading.value)
  const getUserId = computed(() => userId.value)
  const getInformationMembershipLevel = computed(() => informationMembershipLevel.value)

  return {
    detailData,
    userId,
    isTogglePopupBarcode,
    isTogglePopupMembershipInformation,
    handleGetDetailAccount,
    handleTogglePopupBarcode,
    getNextMembershipLevel,
    handleLogout,
    handleTogglePopupMembershipInformation,
    verifyToken,
    getDetailValue,
    getUserId,
    getInformationMembershipLevel,
    getLoading,
  };
});
