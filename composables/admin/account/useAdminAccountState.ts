import { reactive, ref } from 'vue';
import type { AccountDTO, AccountUpdateDTO, LoginDTO } from "@/server/types/dto/v1/account.dto";

export const useAdminAccountState = () => {
  
  const token = ref<string | null>(null);
  const showPassword = ref<boolean>(false)
  const showPasswordConfirm = ref<boolean>(false)
  const oldPassword = ref<string>('')
  const newPassword = ref<string>('')
  const newPasswordConfirm = ref<string>('')
  const userId = ref<string|null>(null)
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

  return {
    showPassword,
    showPasswordConfirm,
    token,
    oldPassword,
    newPassword,
    newPasswordConfirm,
    formUpdate,
    formLogin,
    detailData,
    userId,
    lastVerifiedAt,
    verifyCacheDuration,
  };
};