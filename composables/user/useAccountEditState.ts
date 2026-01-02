import { reactive, ref } from "vue";
import type { UserEdit } from "@/server/types/dto/v1/user.dto";

export const useAccountEditState = () => {
  const isTogglePopupUpdate = ref<boolean>(false);
  const formUserItem = reactive<UserEdit>({
    avatar: '',
    birthday: '',
    fullname: '',
    gender: 'male',
    phone: ''
  });
  const oldPassword = ref<string>('')
  const newPassword = ref<string>('')
  const newPasswordConfirm = ref<string>('')
  const isTogglePopupChangePassword = ref<boolean>(false);
  const showPassword = ref<boolean>(false)
  const showPasswordConfirm = ref<boolean>(false)
  const showOldPassword = ref<boolean>(false)

  return {
    formUserItem,
    isTogglePopupUpdate,
    newPassword,
    newPasswordConfirm,
    isTogglePopupChangePassword,
    showPassword,
    showPasswordConfirm,
    oldPassword,
    showOldPassword,
  };
};
