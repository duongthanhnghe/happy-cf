import { ref, watch, reactive } from "vue";
import { defineStore } from "pinia";
import { accountAPI } from "@/services/v1/admin/account.service";
import { Loading } from '@/utils/global'
import { showConfirm, showSuccess, showWarning} from '@/utils/toast'
import { useAccountAll } from '@/composables/admin/account/useAccountAll'
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
import { useForbiddenHandler } from "@/utils/handle403";
import { ACCOUNT_ROLE } from '@/shared/constants/account-role'
import type { TableOpt, TableHeaders } from '@/server/types/dto/v1/table-vuetify.dto'
import type { AccountDTO, AccountCreateDTO } from '@/server/types/dto/v1/account.dto'

export const useAccountListStore = defineStore("AccountListStore", () => {

  const { getListAccountAllApi, fetchListAccountAll } = useAccountAll()
  const { handleForbiddenAccess } = useForbiddenHandler();

  const dataList = ref<AccountDTO[]>([]);

  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Avatar', key: 'avatar', sortable: false, },
    { title: 'Nguoi dung', key: 'fullname', sortable: false, },
    { title: 'Email', key: 'email', sortable: false, },
    { title: 'Loai nguoi dung', key: 'role', sortable: false, },
    { title: 'Tinh trang', key: 'active', sortable: false, },
    { title: 'Dang nhap', key: 'lastLogin', sortable: false, },
    { title: 'Ngay tham gia', key: 'createdAt', sortable: false, },
    { title: 'Cap nhat', key: 'updatedAt', sortable: false, },
    { title: '', key: 'actions', sortable: false },
  ])
    const serverItems = ref<AccountDTO[]>([])
    const loadingTable = ref<boolean>(true)
    const totalItems = ref<number>(0)
    const name = ref<string>('')
    const search = ref<string>('')
    const filterTypeMember = ref<string>()
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

  const getListData = async () => {
    await fetchListAccountAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage)

    if(!getListAccountAllApi.value) return
    dataList.value = getListAccountAllApi.value.data
    totalItems.value = getListAccountAllApi.value.pagination.total
    currentTableOptions.value.page = getListAccountAllApi.value.pagination.page
    currentTableOptions.value.itemsPerPage = getListAccountAllApi.value.pagination.limit
  }

  const ListAllApi = {
    async fetch({ items, search, filterTypeMember }: {
      items: AccountDTO[],
      search: { fullname: string },
      filterTypeMember?: string
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()

          if (search.fullname) {
            filtered = filtered.filter(item =>
              item.fullname.toLowerCase().includes(search.fullname.toLowerCase())
            )
          }

          if (filterTypeMember) {
            filtered = filtered.filter(item => item.role === filterTypeMember)
          }

          resolve({ items: filtered })
        }, 500)
      })
    },
  }

  async function loadItems(opt: TableOpt) {
    loadingTable.value = true
    await getListData()

    const { items } = await ListAllApi.fetch({
      items: dataList.value || [],
      search: { fullname: name.value },
      filterTypeMember: filterTypeMember.value
    }) as { items: AccountDTO[] }

    serverItems.value = items
    if(getListAccountAllApi.value) totalItems.value = getListAccountAllApi.value.pagination.total

    loadingTable.value = false
  }

  watch([name,filterTypeMember], () => {
    loadItems(currentTableOptions.value);
  })

  watch(() => [currentTableOptions.value.page,currentTableOptions.value.itemsPerPage], () => {
    loadItems(currentTableOptions.value);
  })

  const handleReload = async () => {
    await loadItems(currentTableOptions.value);
  }

  const handleDelete = async (id:string) => {
    const confirm = await showConfirm('Bạn có chắc xoá mục này?')
    if (!confirm) return

    try {
    Loading(true)
      const data =  await accountAPI.delete(id)
      if (data.code === 403) {
        handleForbiddenAccess(data.message);
        return;
      }
      if(data.code === 0){
        showSuccess(data.message)
        if(dataList.value){
          dataList.value = dataList.value.filter(item => 
            item.id !== id
          )
        }
        handleReload()
      } else showWarning(data.message)
      Loading(false)
    } catch (err) {
      console.error('Error submitting form:', err)
    }
  }

  const handleResetPassword = async (email: string) => {
    const confirm = await showConfirm('Reset mat khau cho email ' + email + ' la: ' + newPassword.value + '')
    if (!confirm) return

    if(!email) return
    try {
      const res = await accountAPI.resetPassword(email, newPassword.value);
      if (res.code === 403) {
        handleForbiddenAccess(res.message);
        return;
      }
      showSuccess(res.message);
    } catch (err: any) {
      showWarning(err.message);
    }
  };

  async function submitCreate() {
    Loading(true);
    try {
      const bodyData = {...formCreate}

      const data = await accountAPI.create(bodyData)
      if (data.code === 403) {
        handleForbiddenAccess(data.message);
        return;
      }
      if(data.code === 0){
        showSuccess(data.message);
        handleReload()
        Object.assign(formCreate, defaultForm)
      }
      else showWarning(data.message);
      isTogglePopupCreate.value = false;
      Loading(false);
    } catch (err: any) {
      showWarning(err.message);
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  const handleCreate = () => {
    isTogglePopupCreate.value = true;
  }

  const { toggleActive } = useToggleActiveStatus(accountAPI.toggleActive, serverItems );

  return {
    // state
    dataList,
    serverItems,
    loadingTable,
    totalItems,
    name,
    search,
    headers,
    currentTableOptions,
    filterTypeMember,
    isTogglePopupCreate,
    formCreate,
    handleDelete,
    getListData,
    loadItems,
    handleReload,
    toggleActive,
    handleResetPassword,
    submitCreate,
    handleCreate,
  };
});
