import { reactive, ref } from "vue";
import type { UserLogin, UserRegister } from "@/server/types/dto/v1/user.dto";

export const useAuthState = () => {
  const showPassword = ref<boolean>(false)
  const showPasswordConfirm = ref<boolean>(false)
  const emailForgot = ref<string>('')
  const newPassword = ref<string>('')
  const newPasswordConfirm = ref<string>('')
  const formUserItem = reactive<UserRegister>({
    fullname: '',
    email: '',
    password: '',
    gender: 'male'
  });
  const formUserLoginItem = reactive<UserLogin>({
    email: '',
    password: '',
  });

  return {
    showPassword,
    showPasswordConfirm,
    formUserItem,
    formUserLoginItem,
    emailForgot,
    newPassword,
    newPasswordConfirm,
  };
};
