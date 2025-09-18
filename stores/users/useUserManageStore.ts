import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { usersAPI } from "@/services/users.service";
import {
  Loading
} from '@/utils/global'
import type { User } from '@/server/types/dto/user.dto'
import type { TableOpt, TableHeaders } from '@/server/types/dto/table-vuetify.dto'
import {showConfirm, showSuccess, showWarning} from '@/utils/toast'
import { USER_ROLES } from '@/shared/constants/user-roles'
import { useUserDetail } from '@/composables/user/useUserDetail'
import { useUserAll } from '@/composables/user/useUserAll'
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";


export const useUserManageStore = defineStore("UserManage", () => {

  const { getDetailUserApi, fetchDetailUser } = useUserDetail()
  const { getListUserAllApi, fetchListUserAll } = useUserAll()

  const dataList = ref<User[]>([]);

  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Avatar', key: 'image', sortable: false, },
    { title: 'Khach hang', key: 'fullname', sortable: false, },
    { title: 'Email', key: 'email', sortable: false, },
    { title: 'So dien thoai', key: 'phone', sortable: false, },
    { title: 'Ngay sinh', key: 'birthday', sortable: false, },
    { title: 'Membership', key: 'membership', sortable: false, },
    { title: 'Tinh trang', key: 'active', sortable: false, },
    { title: 'Ngay tham gia', key: 'createdAt', sortable: false, },
    { title: '', key: 'actions', sortable: false },
  ])
    const serverItems = ref<User[]>([])
    const loadingTable = ref<boolean>(true)
    const totalItems = ref<number>(0)
    const name = ref<string>('')
    const phone = ref<string>('')
    const email = ref<string>('')
    const search = ref<string>('')
    const filterTypeMember = ref<string>()
    const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage: 20,
    sortBy: [],
  })
  const isTogglePopupUpdate = ref<boolean>(false);
  const detailData = ref<User|null>(null);
  const role = USER_ROLES.USER;

  const getListData = async () => {
    await fetchListUserAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage,role)

    if(!getListUserAllApi.value) return
    dataList.value = getListUserAllApi.value.data
    totalItems.value = getListUserAllApi.value.pagination.total
    currentTableOptions.value.page = getListUserAllApi.value.pagination.page
    currentTableOptions.value.itemsPerPage = getListUserAllApi.value.pagination.limit
  }

  const ListAllApi = {
    async fetch({ items, search, filterTypeMember }: {
      items: User[],
      search: { fullname: string, phone: string, email: string },
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

          if (search.phone) {
            filtered = filtered.filter(item =>
              item.phone.toLowerCase().includes(search.phone.toLowerCase())
            )
          }

          if (search.email) {
            filtered = filtered.filter(item =>
              item.email.toLowerCase().includes(search.email.toLowerCase())
            )
          }

          if (filterTypeMember) {
            filtered = filtered.filter(item => item.membership.level !== filterTypeMember)
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
      search: { fullname: name.value, phone: phone.value, email: email.value },
      filterTypeMember: filterTypeMember.value
    }) as { items: User[] }

    serverItems.value = items
    if(getListUserAllApi.value) totalItems.value = getListUserAllApi.value.pagination.total

    loadingTable.value = false
  }

  watch([name,phone,filterTypeMember], () => {
    loadItems(currentTableOptions.value);
  })

  watch(() => [currentTableOptions.value.page,currentTableOptions.value.itemsPerPage], () => {
    loadItems(currentTableOptions.value);
  })

  const handleTogglePopupUpdate = (value: boolean) => {
    isTogglePopupUpdate.value = value;
  };

  const handleReload = async () => {
    await loadItems(currentTableOptions.value);
  }

  const handleEdit = async (id:string) => {
    if(!id) return
    await fetchDetailUser(id)
    if(getDetailUserApi.value) detailData.value = getDetailUserApi.value
    if(!detailData.value) return
    handleTogglePopupUpdate(true);
  }

  const handleDelete = async (id:string) => {
    const confirm = await showConfirm('Bạn có chắc xoá mục này?')
    if (!confirm) return

    Loading(true)
    try {
      const data =  await usersAPI.delete(id)
      if(data.code === 200){
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
      Loading(false)
    }
  }

  const { toggleActive } = useToggleActiveStatus(usersAPI.toggleActive, serverItems );

  const getDetailUser = computed(() => detailData.value);
  
  return {
    // state
    dataList,
    isTogglePopupUpdate,
    detailData,
    serverItems,
    loadingTable,
    totalItems,
    name,
    phone,
    email,
    search,
    headers,
    currentTableOptions,
    filterTypeMember,
    // actions
    handleTogglePopupUpdate,
    handleEdit,
    handleDelete,
    getListData,
    loadItems,
    handleReload,
    toggleActive,
    //getters
    getDetailUser,
  };
});
