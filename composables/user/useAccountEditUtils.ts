import { type Reactive, type Ref } from 'vue';
import { authAPI } from "@/services/v1/auth.service";
import { showSuccess, showWarning } from '@/utils/toast';
import { Loading } from '@/utils/global';
import type { ChangePassword, UserEdit } from "@/server/types/dto/v1/user.dto";

export const useAccountEditUtils = (state: {
  isTogglePopupUpdate: Ref<boolean>;
  formUserItem: Reactive<UserEdit>;
  oldPassword: Ref<string>;
  newPassword: Ref<string>;
  newPasswordConfirm: Ref<string>;
  isTogglePopupChangePassword: Ref<boolean>;
  accountStore: any;
}) => {
  const {
    isTogglePopupUpdate,
    formUserItem,
    oldPassword,
    newPassword,
    newPasswordConfirm,
    isTogglePopupChangePassword,
    accountStore,
  } = state;

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
      const data = await authAPI.updateAccount(newCategory)
      if(data.code === 0){
        showSuccess(data.message)
        isTogglePopupUpdate.value = false;
        if(accountStore.detailData) accountStore.detailData = data.data
      } else {
        showWarning(data.message)
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  async function submitChangePassword() {
    try {
      const dataReset:ChangePassword = {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
      }

      const data = await authAPI.ChangePassword(dataReset)
      if(data.code === 0){
        showSuccess('Đặt lại mật khẩu thành công');
        newPassword.value = ''
        newPasswordConfirm.value = ''
        handleTogglePopupChangePassword(false)
      } else {
        newPassword.value = ''
        newPasswordConfirm.value = ''
        showWarning(data.message);
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

  return {
    handleTogglePopupUpdate,
    handleEditAccount,
    submitUpdate,
    submitChangePassword,
    handleTogglePopupChangePassword,
    createNewPasswordRules,
  };
};