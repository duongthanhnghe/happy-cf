import { ref, computed } from "vue";
import { useRouter } from 'vue-router'
import { defineStore } from "pinia";
import { usersAPI } from "@/services/users.service";
import { jwtDecode } from 'jwt-decode'
import type { User, MyJwtPayload, InformationMembershipLevels, MembershipLevels } from '@/server/types/dto/user.dto'
import { ROUTES } from '@/shared/constants/routes';

export const useAccountStore = defineStore("Account", () => {

  const router = useRouter()
  const token = useCookie<string | null>("token", { sameSite: "lax" });
  const isTogglePopupBarcode = ref<boolean>(false);
  const isTogglePopupMembershipInformation = ref<boolean>(false);
  const informationMembershipLevel = ref<InformationMembershipLevels|null>(null);
  const detailData = ref<User|null>(null)
  const userId = ref<string|null>(null)
  const loading = ref(false)

  const handleGetDetailAccount = async (userId: string) => {
    if(!userId) return
    const data = await usersAPI.getDetailAccount(userId)
    detailData.value = data.data;
  };

  const handleTogglePopupBarcode = (value: boolean) => {
    if(isTogglePopupBarcode.value) return
    isTogglePopupBarcode.value = value;
  }

  //popup barcode
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

  const { refresh: refreshAccount } = useAsyncData(
    'accountDetail',
    async () => {
      if (!token.value){
        loading.value = false
        return null;
      } 

      try {
        const decoded = jwtDecode<MyJwtPayload>(token.value)

        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          handleLogout()
          return null
        }

        userId.value = decoded.id
        if (!userId.value) return null

        const data = await usersAPI.getDetailAccount(userId.value)
        detailData.value = data.data
        return data.data
      } catch (err) {
        console.error("Token decode error:", err)
        return null
      } finally {
        loading.value = false
      }
    },
    {
      immediate: true,
      watch: [token],
    }
  )

  //getters
  const getDetailValue = computed(() => detailData.value)
  const getLoading = computed(() => loading.value)
  const getUserId = computed(() => userId.value)
  const getInformationMembershipLevel = computed(() => informationMembershipLevel.value)

  return {
    // state
    detailData,
    userId,
    isTogglePopupBarcode,
    isTogglePopupMembershipInformation,
    // actions
    handleGetDetailAccount,
    handleTogglePopupBarcode,
    getNextMembershipLevel,
    handleLogout,
    handleTogglePopupMembershipInformation,
    refreshAccount,
    //getters
    getDetailValue,
    getUserId,
    getInformationMembershipLevel,
    getLoading,
  };
});
