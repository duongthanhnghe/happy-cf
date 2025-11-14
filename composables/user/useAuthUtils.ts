import { type Reactive, type Ref } from 'vue';
import { Loading, setCookie } from '@/utils/global';
import type { ResetPassword, UserLogin, UserRegister } from '@/server/types/dto/v1/user.dto';
import { showSuccess, showWarning } from '@/utils/toast';
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/v1/auth.service';
import { ROUTES } from '@/shared/constants/routes';
import { useRoute } from 'vue-router'

export const useAuthUtils = (
  emailForgot: Ref<string>,
  newPassword: Ref<string>,
  newPasswordConfirm: Ref<string>,
  formUserItem: Reactive<UserRegister>,
  formUserLoginItem: Reactive<UserLogin>,
) => {

  const router = useRouter()
  const route = useRoute()

  const handleResetFormUserItem = () => {
    formUserItem.fullname = ''
    formUserItem.email = ''
    formUserItem.password = ''
    formUserItem.gender = 'male'
  }

  const handleResetFormLoginItem = () => {
    formUserLoginItem.email = ''
    formUserLoginItem.password = ''
  }

  async function submitLogin() {
    try {
      Loading(true);
      const dataLogin = {...formUserLoginItem}
    
      const data = await authAPI.Login(dataLogin)
      if (data.code === 0 && data.data.token) {
        setCookie('token', data.data.token, 7)
        handleResetFormLoginItem()
        // const decoded = jwtDecode<MyJwtPayload>(data.data.token) 
        // await handleGetDetailAccount(decoded.id)
        setTimeout(() => {
          router.push({ path: ROUTES.PUBLIC.HOME.path })
        }, 500)

      } else {
        showWarning(data.message);
      }
      Loading(false);
    } catch (err: any) {
      showWarning(err.message);
      console.error('Error submitting form:', err)
    }
  }

  async function submitRegister() {
    try {
      Loading(true);
      const dataRegister = {...formUserItem}

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
    }
  }

  async function submitForgotPassword() {
    try {
      Loading(true);
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
    }
  }

  async function submitResetPassword() {
    try {
      Loading(true);
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
      Loading(false);
    } catch (err: any) {
      showWarning(err.message);
      console.error('Error submitting form:', err)
    }
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
        // const decoded = jwtDecode<MyJwtPayload>(data.data.token)
        // await handleGetDetailAccount(decoded.id)
        setTimeout(() => {
          router.push({ path: ROUTES.PUBLIC.HOME.path })
        }, 500)

      }
    } catch (err: any) {
      showWarning(err.message)
      console.error('Error submitting form:', err)
    }
  }

  return {
    handleResetFormUserItem,
    handleResetFormLoginItem,
    submitLogin,
    submitRegister,
    submitForgotPassword,
    handleGoogleLogin,
    submitResetPassword,
  };
};