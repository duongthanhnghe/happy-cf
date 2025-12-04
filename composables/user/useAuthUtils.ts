import { type Reactive, type Ref } from 'vue';
import type { ResetPassword, UserLogin, UserRegister } from '@/server/types/dto/v1/user.dto';
import { showSuccess, showWarning } from '@/utils/toast';
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/v1/auth.service';
import { ROUTES } from '@/shared/constants/routes';
import { useRoute } from 'vue-router'
import { useAccountStore } from '@/stores/client/users/useAccountStore';

export const useAuthUtils = (
  emailForgot: Ref<string>,
  newPassword: Ref<string>,
  newPasswordConfirm: Ref<string>,
  formUserItem: Reactive<UserRegister>,
  formUserLoginItem: Reactive<UserLogin>,
  loadingAuth: Ref<boolean>,
) => {
  const accountStore = useAccountStore();
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
    loadingAuth.value = true
    try {
      const dataLogin = { ...formUserLoginItem }
      const data = await authAPI.Login(dataLogin)

      if (data.code === 0 && data.data.accessToken) {
        accountStore.token = data.data.accessToken  
        await accountStore.handleGetDetailAccount(data.data.user.id);

        handleResetFormLoginItem()
        router.push({ path: ROUTES.PUBLIC.HOME.path })
      } else {
        showWarning(data.message)
      }
    } catch (err: any) {
      showWarning(err.message)
      console.error('Error submitting form:', err)
    } finally {
      loadingAuth.value = false
    }
  }

  async function submitRegister() {
    loadingAuth.value = true
    try {
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
    } catch (err: any) {
      showWarning(err.message);
      console.error('Error submitting form:', err)
    } finally {
      loadingAuth.value = false
    }
  }

  async function submitForgotPassword() {
    loadingAuth.value = true
    try {
      const data = await authAPI.ForgotPassword(emailForgot.value)
      if(data.code === 0){
        showSuccess(data.message)
        emailForgot.value = ''
      }
      else showWarning(data.message);
    } catch (err: any) {
      showWarning(err.message);
      console.error('Error submitting form:', err)
    } finally {
      loadingAuth.value = false
    }
  }

  async function submitResetPassword() {
    loadingAuth.value = true
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
    } finally {
      loadingAuth.value = false
    }
  }

  const handleGoogleLogin = async (response: any) => {
    loadingAuth.value = true
    try {
      const googleToken = response?.credential

      if (!googleToken) {
        throw new Error("Thiếu token Google")
      }

      const data = await authAPI.googleLogin(googleToken)
      if (data.code === 0) {
        accountStore.token = data.data.accessToken  
        await accountStore.handleGetDetailAccount(data.data.user.id);

        router.push({ path: ROUTES.PUBLIC.HOME.path })
      }
    } catch (err: any) {
      showWarning(err.message)
      console.error('Error submitting form:', err)
    } finally {
      loadingAuth.value = false
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