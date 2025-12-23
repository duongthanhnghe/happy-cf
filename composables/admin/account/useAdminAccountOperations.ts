import { showWarning, showSuccess } from "@/utils/toast";
import { unref, type Ref } from 'vue';
import { Loading } from "@/utils/global";
import { useRouter } from 'vue-router'
import { accountAPI } from "@/services/v1/admin/account.service";
import { ROUTES } from "@/shared/constants/routes";
import type { AccountDTO, AccountUpdateDTO, ChangePasswordDTO, LoginDTO } from "@/server/types/dto/v1/account.dto";
type MaybeRef<T> = T | Ref<T>;

export const useAdminAccountOperations = (
  token: Ref<string | null>,
  formLogin: MaybeRef<LoginDTO>,
  formUpdate: MaybeRef<AccountUpdateDTO>,
  oldPassword: Ref<string>,
  newPassword: Ref<string>,
  newPasswordConfirm: Ref<string>,
  userId: Ref<string | null>,
  detailData: Ref<AccountDTO | null>,
  lastVerifiedAt: Ref<number>,
  verifyCacheDuration: number,
) => {
  const router = useRouter()

  const handleResetLogin = () => {
    unref(formLogin).email = ''
    unref(formLogin).password = ''
  }

  async function submitLogin() {
    try {
      Loading(true);

      const dataLogin = {...unref(formLogin)}
    
      const data = await accountAPI.Login(dataLogin)
      if (data.code === 0 && data.data.accessToken) {
        token.value = data.data.accessToken
        handleResetLogin()
        await handleGetDetailAccount(data.data.account.id)
        router.push({ path: ROUTES.ADMIN.BASE_INFORMATION.path })
      } else {
        showWarning(data.message ?? '');
      }
    } catch (err: any) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleGetDetailAccount = async (id: string) => {
    if(!id) return
    const data = await accountAPI.getAccount(id)
    if(data.code === 0){
      detailData.value = data.data;
      userId.value = data.data.id;
      Object.assign(formUpdate, detailData.value);
    } 
  };

  async function submitUpdate() {
    try {
      Loading(true);
      const payload = {...unref(formUpdate)}
      const data = await accountAPI.updateAccount(payload)
      if(data.code === 0){
        showSuccess('Cap nhat thanh cong')
        detailData.value = data.data
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  async function submitChangePassword(userId: string, oldPasswordInput: string) {
    try {
      if (!userId || !oldPasswordInput) {
        showWarning('Thiếu thông tin userId hoặc oldPassword');
        return;
      }
      Loading(true);

      const dataReset:ChangePasswordDTO = {
        id: userId,
        oldPassword: oldPasswordInput,
        newPassword: newPassword.value
      }
      
      const data = await accountAPI.changePassword(dataReset)
      if(data.code === 1){
        showWarning('Token không hợp lệ hoặc đã hết hạn!');
      }
      else if(data.code === 2){
        showWarning('Không tìm thấy tài khoản!');
      }
      else if(data.code === 3){
        showWarning('Mật khẩu cũ không đúng!');
      }
      else if(data.code === 0){
        showSuccess('Đổi mật khẩu thành công!');
        oldPassword.value = ''
        newPassword.value = ''
        newPasswordConfirm.value = ''
      } else {
        oldPassword.value = ''
        newPassword.value = ''
        newPasswordConfirm.value = ''
        showWarning('Có lỗi!');
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleLogout = async () => {
    try {
      Loading(true);
      const res = await accountAPI.Logout();

      if (res.code === 0) {
        token.value = null;
        detailData.value = null;
        lastVerifiedAt.value = 0;
        router.push({ path: ROUTES.ADMIN.LOGIN.path });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      Loading(false);
    }
  }

  async function verifyToken(force = false): Promise<boolean|null> {
    if (!token.value) {
      const refreshed = await refreshToken();
      if (!refreshed) return false;
    }

    const now = Date.now()

    if (!force && detailData.value && now - lastVerifiedAt.value < verifyCacheDuration) {
      return true
    }

    const res = await accountAPI.verifyToken()
    if (res.code === 0 && res.data) {
      lastVerifiedAt.value = now
      await handleGetDetailAccount(res.data.id);
      return true
    }

    return false
  }

    async function refreshToken() {
    const res = await accountAPI.refreshToken();
    if (res.code === 0 && res.data?.accessToken ) {
      token.value = res.data?.accessToken
      return true;
    }

    return false;
  }

  return {
    handleResetLogin,
    submitLogin,
    handleLogout,
    submitUpdate,
    handleGetDetailAccount,
    submitChangePassword,
    verifyToken,
    refreshToken,
  };
};