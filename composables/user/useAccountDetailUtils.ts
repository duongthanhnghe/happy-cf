import { type Ref } from 'vue';
import { ROUTES } from "@/shared/constants/routes";
import { authAPI } from "@/services/v1/auth.service";
import { useRouter } from 'vue-router'
import type { InformationMembershipLevels, MembershipLevels, User } from "@/server/types/dto/v1/user.dto";
import { usePendingRewardPoints } from '../order/usePendingRewardPoints';
import { useWishlistStore } from '@/stores/client/users/useWishlistStore';
import { useMembershipStore } from '@/stores/client/users/useMembershipStore';

export const useAccountDetailUtils = (state: {
  detailData: Ref<User | null>,
  isTogglePopupBarcode: Ref<boolean>,
  isTogglePopupMembershipInformation: Ref<boolean>,
  informationMembershipLevel: Ref<InformationMembershipLevels|null>,
  token: Ref<string | null>,
  userId: Ref<string|null>,
  lastVerifiedAt: Ref<number>,
  verifyCacheDuration: number,
  isTogglePopupAccountMenuInfo: Ref<boolean>,
}) => {
  const {
    detailData,
    isTogglePopupBarcode,
    isTogglePopupMembershipInformation,
    informationMembershipLevel,
    token,
    userId,
    lastVerifiedAt,
    verifyCacheDuration,
    isTogglePopupAccountMenuInfo,
  } = state;

  const router = useRouter()
  const storeWishList = useWishlistStore()
  const storeMembership = useMembershipStore();
  const { fetchPendingRewardPoints, getPendingReward } = usePendingRewardPoints()
  
  const handleGetDetailAccount = async (id: string) => {
    if(!id) return
    const data = await authAPI.getDetailAccount(id)
    if(data.code === 0) detailData.value = data.data;
    userId.value = id;
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

  const handleLogout = async () => {
    const res = await authAPI.logout();
    if(res.code === 0){
      token.value = null
      detailData.value = null
      userId.value = null

      router.push({ path: ROUTES.PUBLIC.HOME.path })
    }
  }

  async function verifyToken(force = false): Promise<null|boolean> {
    if (!token.value) {
      const refreshed = await refreshToken();
      if (!refreshed) return false;
    }

    const now = Date.now()
    
    if (!force && detailData.value && now - lastVerifiedAt.value < verifyCacheDuration) {
      return true
    }

    const res = await authAPI.verifyToken()
    if (res.code === 0 && res.data) {
      lastVerifiedAt.value = now
      await storeMembership.fetchMembershipStore()
      await handleGetDetailAccount(res.data.id)
      storeWishList.fetchWishlist(res.data.id)
      if(storeMembership.getListData.length > 0) getNextMembershipLevel(storeMembership.getListData)
      return true
    }

    return false
  }

  async function refreshToken() {
    const res = await authAPI.refreshToken();
    if (res.code === 0 && res.data?.accessToken ) {
      token.value = res.data?.accessToken
      return true;
    }

    return false;
  }

  const handleTogglePopupAccountMenuInfo = (value: boolean) => {
    isTogglePopupAccountMenuInfo.value = value;
  }

  return {
    handleGetDetailAccount,
    handleTogglePopupBarcode,
    handleTogglePopupMembershipInformation,
    getNextMembershipLevel,
    handleLogout,
    verifyToken,
    refreshToken,
    handleTogglePopupAccountMenuInfo,
    fetchPendingRewardPoints,
    getPendingReward,
  };
};