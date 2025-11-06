import { ref, reactive, computed} from "vue";
import { defineStore } from "pinia";
import { apiConfig } from '@/services/config/api.config'
import { authAPI } from "@/services/v1/auth.service";
import {
  Loading
} from '@/utils/global'
import type { UserEdit, ChangePassword } from '@/server/types/dto/v1/user.dto'
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { showWarning, showSuccess } from "@/utils/toast";

export const useAccountEditStore = defineStore("useAccountEdit", () => {
  const accountStore = useAccountStore()

  const token = useCookie<string | null>("token", { sameSite: "lax" });
  const isTogglePopupUpdate = ref<boolean>(false);
  const formUserItem = reactive<UserEdit>({
    avatar: '',
    birthday: '',
    fullname: '',
    gender: 'male',
    phone: ''
  });
  const newPassword = ref<string>('')
  const newPasswordConfirm = ref<string>('')
  const isTogglePopupChangePassword = ref<boolean>(false);
  const showPassword = ref<boolean>(false)
  const showPasswordConfirm = ref<boolean>(false)

  //actions
  const handleTogglePopupUpdate = (value: boolean) => {
    isTogglePopupUpdate.value = value;
  };

  const handleEditAccount = async () => {
    if(!accountStore.getDetailValue) return
      handleTogglePopupUpdate(true);
      formUserItem.avatar = accountStore.getDetailValue.avatar
      formUserItem.birthday = accountStore.getDetailValue.birthday
      formUserItem.fullname = accountStore.getDetailValue.fullname
      formUserItem.gender = accountStore.getDetailValue.gender
      formUserItem.phone = accountStore.getDetailValue.phone
  }

  async function submitUpdate() {
    Loading(true);
    try {
      const newCategory = {...formUserItem}
      const data = await authAPI.updateAccount(newCategory, token.value)
      if(data.code === 200){
        showSuccess('Cap nhat thanh cong')
        isTogglePopupUpdate.value = false;
        if(accountStore.detailData) accountStore.detailData = data.data
      } else {
        showWarning('Cap nhat loi!')
      }
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  async function submitChangePassword(userId: string, oldPassword: string) {
    try {
      if (!userId || !oldPassword) {
        showWarning('Thiếu thông tin userId hoặc oldPassword');
        return;
      }

      const dataReset:ChangePassword = {
        userId: userId,
        oldPassword: oldPassword,
        newPassword: newPassword.value
      }

      const data = await authAPI.ChangePassword(dataReset)
      if(data.code === 2){
        showWarning('Không tìm thấy tài khoản admin');
      }
      else if(data.code === 1){
        showWarning('Thiếu mật khẩu cũ hoặc mới');
      }
      else if(data.code === 3){
        showWarning('Mật khẩu cũ không đúng');
      }
      else if(data.code === 0){
        showSuccess('Đặt lại mật khẩu thành công');
        newPassword.value = ''
        newPasswordConfirm.value = ''
        handleTogglePopupChangePassword(false)
      } else {
        newPassword.value = ''
        newPasswordConfirm.value = ''
        showWarning('Vui long nhap mat khau day du!');
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    }
  }

  const handleTogglePopupChangePassword = (value: boolean) => {
    isTogglePopupChangePassword.value = value;
  };

  const createNewPasswordRules = (newPasswordConfirm: string) => [
    (value: string) => !!value || 'Mật khẩu không được để trống',
    (value: string) => value.length >= 8 || 'Mật khẩu phải có ít nhất 8 ký tự',
    (value: string) => /[A-Z]/.test(value) || 'Phải có ít nhất 1 chữ in hoa',
    (value: string) => /[a-z]/.test(value) || 'Phải có ít nhất 1 chữ thường',
    (value: string) => /[0-9]/.test(value) || 'Phải có ít nhất 1 số',
    (value: string) => /[^A-Za-z0-9]/.test(value) || 'Phải có ít nhất 1 ký tự đặc biệt',
    (value: string) => value === newPasswordConfirm || 'Mật khẩu không giống nhau'
  ]

  const getBirthday = computed({
    get: () => {
      if (!formUserItem.birthday) return ''
      return new Date(formUserItem.birthday).toISOString().split("T")[0]
    },
    set: (val: string) => {
      formUserItem.birthday = val
    }
  })

  const newPasswordRules = computed(() => createNewPasswordRules(newPasswordConfirm.value))

  return {
    formUserItem,
    isTogglePopupUpdate,
    newPassword,
    newPasswordConfirm,
    isTogglePopupChangePassword,
    showPassword,
    showPasswordConfirm,
    handleEditAccount,
    submitUpdate,
    handleTogglePopupUpdate,
    submitChangePassword,
    handleTogglePopupChangePassword,
    newPasswordRules,
    getBirthday
  };
});

