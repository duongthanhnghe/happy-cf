import { ref, reactive, computed } from "vue";
import { defineStore } from "pinia";
import { accountAPI } from "@/services/v1/admin/account.service";
import { Loading } from '@/utils/global'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { showWarning, showSuccess } from "@/utils/toast";
import type { MyJwtPayload } from '@/server/types/dto/v1/user.dto'
import { ROUTES } from '@/shared/constants/routes';
import { setCookie } from '@/utils/global'
import type { AccountDTO, LoginDTO, AccountUpdateDTO, ChangePasswordDTO } from "@/server/types/dto/v1/account.dto";

export const useAccountStore = defineStore("AccountStore", () => {

  const router = useRouter()
  const token = useCookie<string | null>("admin_token", { sameSite: "lax" });
  const showPassword = ref<boolean>(false)
  const showPasswordConfirm = ref<boolean>(false)
  const oldPassword = ref<string>('')
  const newPassword = ref<string>('')
  const newPasswordConfirm = ref<string>('')
  const detailData = ref<AccountDTO|null>(null)
  const lastVerifiedAt = ref<number>(0)
  const verifyCacheDuration = 15 * 60 * 1000 // 15 phút

  const formLogin = reactive<LoginDTO>({
    email: '',
    password: '',
  });

  const formUpdate = reactive<AccountUpdateDTO>({
    id: '',
    avatar: '',
    fullname: '',
  });

  const handleResetLogin = () => {
    formLogin.email = ''
    formLogin.password = ''
  }

  async function submitLogin() {
    try {
      Loading(true);

      const dataLogin = {
        email: formLogin.email,
        password: formLogin.password,
      }
    
      const data = await accountAPI.Login(dataLogin)
      if (data.code === 0 && data.data.token) {
        setCookie('admin_token', data.data.token, 7)
        handleResetLogin()
        const decoded = jwtDecode<MyJwtPayload>(data.data.token) 
        await handleGetDetailAccount(decoded.id)
        setTimeout(() => {
          router.push({ path: ROUTES.ADMIN.BASE_INFORMATION.path })
        }, 500)
      } else {
        showWarning(data.message ?? '');
      }
      Loading(false);
    } catch (err: any) {
      showWarning(err.message);
      console.error('Error submitting form:', err)
    }
  }

  const handleGetDetailAccount = async (userId: string) => {
    if(!userId) return
    Loading(true);
    const data = await accountAPI.getAccount(userId)
    if(data.code === 0){
      detailData.value = data.data;
      Object.assign(formUpdate, detailData.value);
    } 
    Loading(false);
  };

  async function submitUpdate() {
    try {
      Loading(true);
      const payload = {...formUpdate}
      const data = await accountAPI.updateAccount(payload)
      if(data.code === 0){
        showSuccess('Cap nhat thanh cong')
        detailData.value = data.data
      } else {
        showWarning(data.message ?? '')
      }
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
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
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
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
      Loading(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  async function verifyToken(force = false): Promise<boolean> {
    try {
      if (!token.value) return false

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

      console.warn("verifyToken failed:", res.message)
      return false
    } catch (err: any) {
      console.error("verifyToken error:", err)
      return false
    }
  }

  const getDetailAccount = computed(() => detailData.value)

  return {
    // state
    showPassword,
    showPasswordConfirm,
    token,
    oldPassword,
    newPassword,
    newPasswordConfirm,
    formUpdate,
    formLogin,
    detailData,
    // actions
    handleResetLogin,
    submitLogin,
    handleLogout,
    submitUpdate,
    handleGetDetailAccount,
    submitChangePassword,
    verifyToken,
    getDetailAccount,
    // refreshAccount,
  };
});
