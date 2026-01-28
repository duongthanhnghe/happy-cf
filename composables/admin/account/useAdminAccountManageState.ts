import { reactive, ref } from 'vue';
import type { AccountCreateDTO, AccountDTO, AccountRoleType } from "@/server/types/dto/v1/account.dto";
import type { TableHeaders, TableOpt } from '@/server/types';
import { ACCOUNT_ROLE } from '@/shared/constants/account-role';

export const useAdminAccountManageState = () => {
  
  const dataList = ref<AccountDTO[]>([]);
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Ảnh đại diện', key: 'avatar', sortable: false },
    { title: 'Người dùng', key: 'fullname', sortable: false },
    { title: 'Email', key: 'email', sortable: false },
    { title: 'Loại người dùng', key: 'role', sortable: false },
    { title: 'Trạng thái', key: 'active', sortable: false },
    { title: 'Lần đăng nhập', key: 'lastLogin', sortable: false },
    { title: 'Ngày tham gia', key: 'createdAt', sortable: false },
    { title: 'Cập nhật', key: 'updatedAt', sortable: false },
    { title: '', key: 'actions', sortable: false },
  ])
    const serverItems = ref<AccountDTO[]>([])
    const loadingTable = ref<boolean>(true)
    const totalItems = ref<number>(0)
    const search = ref<string>('')
    const searchInput = ref<string>('')
    const filterTypeMember = ref<AccountRoleType|null>(null)
    const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage: 20,
    sortBy: [],
  })
  const newPassword = ref('Password@123!');
  const isTogglePopupCreate = ref<boolean>(false);
  const defaultForm = reactive<AccountCreateDTO>({
    fullname: '',
    email: '',
    password: newPassword.value,
    role: ACCOUNT_ROLE.editor.value,
  });
  const formCreate = reactive<AccountCreateDTO>({ ...defaultForm });

  return {
    dataList,
    serverItems,
    loadingTable,
    totalItems,
    search,
    searchInput,
    headers,
    currentTableOptions,
    filterTypeMember,
    isTogglePopupCreate,
    formCreate,
    defaultForm,
    newPassword,
  };
};