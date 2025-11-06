import { ref, reactive, computed } from "vue";
import { defineStore } from "pinia";
import { adminAuthAPI } from "@/services/v1/admin/adminAuth.service";
import {
  Loading
} from '@/utils/global'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { showWarning, showSuccess } from "@/utils/toast";
import type { MyJwtPayload } from '@/server/types/dto/v1/user.dto'
import { ROUTES } from '@/shared/constants/routes';
import { setCookie } from '@/utils/global'
import type { AdminAccountDTO, AdminLoginDTO, AdminUpdateDTO, ChangePasswordDTO } from "@/server/types/dto/v1/admin-auth.dto";

export const useAdminAuthStore = defineStore("AdminAuthStore", () => {

  const router = useRouter()
  const route = useRoute()
  const token = useCookie<string | null>("admin_token", { sameSite: "lax" });
  const showPassword = ref<boolean>(false)
  const showPasswordConfirm = ref<boolean>(false)
  const oldPassword = ref<string>('')
  const newPassword = ref<string>('')
  const newPasswordConfirm = ref<string>('')
  const detailData = ref<AdminAccountDTO|null>(null)
  const userId = ref<string|null>(null)
  const loading = ref(false)
  const lastVerifiedAt = ref<number>(0)
  const verifyCacheDuration = 15 * 60 * 1000 // 15 phút

  const formLogin = reactive<AdminLoginDTO>({
    email: '',
    password: '',
  });

  const formUpdate = reactive<AdminUpdateDTO>({
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
    
      const data = await adminAuthAPI.Login(dataLogin)
      if (data.code === 0 && data.data.token) {
        setCookie('admin_token', data.data.token, 7)
        handleResetLogin()
        const decoded = jwtDecode<MyJwtPayload>(data.data.token) 
        await handleGetDetailAccount(decoded.id)
        setTimeout(() => {
          router.push({ path: ROUTES.ADMIN.SETTINGS.path })
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
    const data = await adminAuthAPI.getAccount(userId)
    if(data.code === 0){
      detailData.value = data.data;
      Object.assign(formUpdate, detailData.value);
    } 
  };

  async function submitUpdate() {
    try {
      Loading(true);
      const payload = {...formUpdate}
      const data = await adminAuthAPI.updateAccount(payload)
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
      
      const data = await adminAuthAPI.changePassword(dataReset)
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
      const res = await adminAuthAPI.Logout();

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

      const res = await adminAuthAPI.verifyToken()

      if (res.code === 0 && res.data) {
        lastVerifiedAt.value = now
        return true
      }

      console.warn("verifyToken failed:", res.message)
      return false
    } catch (err: any) {
      console.error("verifyToken error:", err)
      return false
    }
  }

  const { refresh: refreshAccount } = useAsyncData(
    'accountDetailAdmin',
    async () => {
      if (!token.value){
        loading.value = false
        return null;
      } 

      try {
        const decoded = jwtDecode<MyJwtPayload>(token.value)

        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          handleLogout()
          return null
        }

        userId.value = decoded.id
        if (!userId.value) return null

        handleGetDetailAccount(userId.value)

        return detailData.value
      } catch (err) {
        console.error("Token decode error:", err)
        return null
      } finally {
        loading.value = false
      }
    },
    {
      immediate: true,
      watch: [token],
    }
  )

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
    refreshAccount,
  };
});
