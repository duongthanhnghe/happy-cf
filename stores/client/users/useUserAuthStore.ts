import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { authAPI } from "@/services/v1/auth.service";
import {
  Loading
} from '@/utils/global'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { showWarning, showSuccess } from "@/utils/toast";
import type { UserRegister, ResetPassword, MyJwtPayload } from '@/server/types/dto/v1/user.dto'
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { ROUTES } from '@/shared/constants/routes';
import { setCookie } from '@/utils/global'
import { USER_ROLES } from "@/shared/constants/user-roles";

export const useUserAuthStore = defineStore("UserAuth", () => {

const storeAccount = useAccountStore();

//state global  
const router = useRouter()
const route = useRoute()
// const token = ref<string | null>(process.client ? localStorage.getItem('token') : null)
const token = useCookie<string | null>("token", { sameSite: "lax" });
const valid = ref<boolean>(false)
const showPassword = ref<boolean>(false)
const showPasswordConfirm = ref<boolean>(false)
const emailForgot = ref<string>('')
const newPassword = ref<string>('')
const newPasswordConfirm = ref<string>('')


const emailRules = [
  (value: string) => !!value || 'Email không được để trống',
  (value: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(value) || 'Email không hợp lệ'
  }
]

const fullnameRules = [
  (value: string) => {
    if (value) return true
    return 'Ho va ten khong duoc trong'
  },
]

const passwordRules = [
  (value: string) => !!value || 'Mật khẩu không được để trống',
  (value: string) => value.length >= 8 || 'Mật khẩu phải có ít nhất 8 ký tự',
  (value: string) => /[A-Z]/.test(value) || 'Mật khẩu phải có ít nhất 1 chữ cái in hoa',
  (value: string) => /[a-z]/.test(value) || 'Mật khẩu phải có ít nhất 1 chữ cái thường',
  (value: string) => /[0-9]/.test(value) || 'Mật khẩu phải có ít nhất 1 số',
  (value: string) => /[^A-Za-z0-9]/.test(value) || 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt'
]

const formUserItem = reactive<UserRegister>({
  fullname: '',
  email: '',
  password: '',
  gender: 'male'
});

const timeout = ref<ReturnType<typeof setTimeout> | undefined>();

  const handleResetFormUserItem = () => {
    formUserItem.fullname = ''
    formUserItem.email = ''
    formUserItem.password = ''
    formUserItem.gender = 'male'
  }

  //actions add
  async function submitLogin() {
    Loading(true);
    try {
      const dataLogin = {
        email: formUserItem.email,
        password: formUserItem.password,
      }
    
      const data = await authAPI.Login(dataLogin)
      if (data.code === 0 && data.data.token) {
        setCookie('token', data.data.token, 7)
        handleResetFormUserItem()
        const decoded = jwtDecode<MyJwtPayload>(data.data.token) 
        await storeAccount.handleGetDetailAccount(decoded.id)
        setTimeout(() => {
          if(data.data.user.role === USER_ROLES.ADMIN) router.push({ path: ROUTES.ADMIN.SETTINGS.path })
          else router.push({ path: ROUTES.PUBLIC.HOME.path })
        }, 500)

      } else {
        showWarning(data.message);
      }
      Loading(false);
    } catch (err: any) {
      showWarning(err.message);
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  async function submitRegister() {
    Loading(true);
    try {
      
      const dataRegister = {
        fullname: formUserItem.fullname,
        email: formUserItem.email,
        password: formUserItem.password,
        gender: formUserItem.gender,
      }

      const data = await authAPI.Register(dataRegister)
      if(data.code === 0){
        showSuccess(data.message);
        handleResetFormUserItem()
        setTimeout(function(){
          router.push({ path: ROUTES.PUBLIC.LOGIN.path })
        }, 1000);
      }
      else showWarning(data.message);
      Loading(false);
    } catch (err: any) {
      showWarning(err.message);
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  async function submitForgotPassword() {
    Loading(true);
    try {
      const data = await authAPI.ForgotPassword(emailForgot.value)
      if(data.code === 0){
        showSuccess(data.message)
        emailForgot.value = ''
      }
      else showWarning(data.message);
      Loading(false);
    } catch (err: any) {
      showWarning(err.message);
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  async function submitResetPassword() {
    Loading(true);
      try {
        const email = route.query.email as string
        const token = route.query.token as string
        if (email === null || token === null) {
          showWarning('Thiếu thông tin email hoặc token');
          return;
        }

        const dataReset:ResetPassword = {
          email: email,
          token: token,
          newPassword: newPassword.value
        }

        const data = await authAPI.ResetPassword(dataReset)
        if(data.code === 0){
          showSuccess(data.message);
          newPassword.value = ''
          newPasswordConfirm.value = ''
          setTimeout(function(){
            router.push({ path: ROUTES.PUBLIC.LOGIN.path })
          }, 3000);
        } else {
          newPassword.value = ''
          newPasswordConfirm.value = ''
          showWarning(data.message);
        }
      } catch (err: any) {
        showWarning(err.message);
        console.error('Error submitting form:', err)
      }
      Loading(false);
  }

  const handleGoogleLogin = async (response: any) => {
    try {
      const googleToken = response?.credential

      if (!googleToken) {
        throw new Error("Thiếu token Google")
      }

      const data = await authAPI.googleLogin(googleToken)
      if (data.code === 0) {
        setCookie('token', data.data.token, 7)

        const decoded = jwtDecode<MyJwtPayload>(data.data.token)
        await storeAccount.handleGetDetailAccount(decoded.id)
        setTimeout(() => {
          if(data.data.user.role === USER_ROLES.ADMIN) router.push({ path: ROUTES.ADMIN.SETTINGS.path })
          else router.push({ path: ROUTES.PUBLIC.HOME.path })
        }, 500)

      }
    } catch (err: any) {
      showWarning(err.message)
      console.error('Error submitting form:', err)
      Loading(false)
    }
  }

  return {
    // state
    showPassword,
    showPasswordConfirm,
    token,
    valid,
    fullnameRules,
    emailRules,
    passwordRules,
    formUserItem,
    emailForgot,
    newPassword,
    newPasswordConfirm,
    // actions
    handleResetFormUserItem,
    submitLogin,
    submitRegister,
    submitForgotPassword,
    submitResetPassword,
    handleGoogleLogin,
  };
});
