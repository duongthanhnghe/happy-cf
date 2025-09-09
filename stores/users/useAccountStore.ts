import { ref, computed, watch } from "vue";
import { useRouter } from 'vue-router'
import { defineStore } from "pinia";
import { usersAPI } from "@/services/users.service";
import { jwtDecode } from 'jwt-decode'
import type { User, MyJwtPayload, InformationMembershipLevels, MembershipLevels } from '@/server/types/dto/user.dto'
import { ROUTES } from '@/shared/constants/routes';

export const useAccountStore = defineStore("Account", () => {

  const router = useRouter()
  const token = ref<string | null>(process.client ? localStorage.getItem('token') : null)
  const isTogglePopupBarcode = ref<boolean>(false);
  const informationMembershipLevel = ref<InformationMembershipLevels|null>(null);
  const detailData = ref<User|null>(null)
  const userId = ref<string|null>(null)

  //actions
  const handleGetDetailAccount = async (userId: string) => {
    const data = await usersAPI.getDetailAccount(userId)
    detailData.value = data.data;
  };

  //popup barcode
  const handleTogglePopupBarcode = (value: boolean) => {
    isTogglePopupBarcode.value = value;
  }

  //check next level
  const handleNextMembershipLevel = (currentPoint: number, membershipLevels: MembershipLevels[]) => {
    const sortedLevels = [...membershipLevels].sort((a, b) => a.minPoint - b.minPoint)
    const maxLevelPoint = membershipLevels.at(-1)?.minPoint as number

    const currentLevel = sortedLevels
      .filter(level => currentPoint >= level.minPoint)
      .slice(-1)[0]

    const currentIndex = sortedLevels.findIndex(l => l.id === currentLevel.id)
    const nextLevel = currentPoint < maxLevelPoint ? sortedLevels[currentIndex + 1] : sortedLevels[currentIndex]

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
    token.value = ''
    localStorage.removeItem('token');
    router.push({ path: ROUTES.PUBLIC.HOME.path })
    detailData.value = null;
  }

  const initDetailAccount = (token: string) => {
    try {
      const decoded = jwtDecode<MyJwtPayload>(token) 

      if (decoded.exp && decoded.exp * 1000 < Date.now()) { //het han token
        handleLogout()
        return
      }

      userId.value = decoded.id 
      if(userId.value) handleGetDetailAccount(userId.value)
    } catch (err) {
      console.error('Token decode error:', err)
    }
  }

  watch(() => token.value, (newValue) => {
    if(newValue) initDetailAccount(newValue)
  },
  { immediate: true }
  )

  //getters
  const getDetailValue = computed(() => detailData.value)
  const getUserId = computed(() => userId.value)
  const getInformationMembershipLevel = computed(() => informationMembershipLevel.value)

  return {
    // state
    detailData,
    userId,
    isTogglePopupBarcode,
    
    // actions
    handleGetDetailAccount,
    handleTogglePopupBarcode,
    getNextMembershipLevel,
    handleLogout,
    //getters
    getDetailValue,
    getUserId,
    getInformationMembershipLevel,
  };
});
