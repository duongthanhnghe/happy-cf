import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useAdminUserDetail } from "@/composables/user/useAdminUserDetail";
import { formatDateTime } from "@/utils/global";

export const useAdminUserDetailStore = defineStore("AdminUserDetail", () => {
  const { getDetailUserApi, fetchDetailUser } = useAdminUserDetail()

  const isTogglePopup = ref<boolean>(false);
  const handleTogglePopup = async (value: boolean, idUser: string) => {
    await fetchDetailUser(idUser)
    isTogglePopup.value = value;
  };
  
  const getDetailUser = computed(() => getDetailUserApi.value);
  
  const infoItems = computed(() => [
    { label: 'Email', value: getDetailUser.value?.email, icon: 'email' },
    { label: 'Số điện thoại', value: getDetailUser.value?.phone, icon: 'phone' },
    { label: 'Giới tính', value: getDetailUser.value?.gender, icon: 'edit' },
    { label: 'Ngày sinh', value: formatDateTime(getDetailUser.value?.birthday,'vi-VN',false), icon: 'calendar_today' },
    { label: 'Mã khách hàng', value: getDetailUser.value?.gender, icon: 'code' },
    { label: 'Ngày tham gia', value: formatDateTime(getDetailUser.value?.membership.joinedAt,'vi-VN',false), icon: 'calendar_check' },
  ])

  const membershipItems = computed(() => [
    { label: 'Điểm thăng hạn', value: getDetailUser.value?.membership.point, icon: 'workspace_premium' },
    { label: 'Điểm tích luỹ', value: getDetailUser.value?.membership.balancePoint, icon: 'diamond_shine' },
    { label: '% giảm giá thành viên', value: getDetailUser.value?.membership.discountRate, icon: 'shopping_cart' },
    { label: '% tích luỹ điểm', value: getDetailUser.value?.membership.pointRate, icon: 'percent' },
  ])

  return {
    isTogglePopup,
    handleTogglePopup,
    fetchDetailUser,
    getDetailUser,
    infoItems,
    membershipItems,
  };
});
