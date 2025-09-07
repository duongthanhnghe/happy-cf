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
//state list
const dataList = ref<User[]| null>(null);

const itemsPerPage = 10
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
  itemsPerPage: itemsPerPage,
  sortBy: [],
})

//state edit
const isTogglePopupUpdate = ref<boolean>(false);
const detailData = ref<User|null>(null);

//actions list
const getListData = async () => {
  await fetchListUserAll()
  if(getListUserAllApi.value) dataList.value = getListUserAllApi.value
}

const ListAllApi = {
    async fetch ({
      page, itemsPerPage, sortBy,
      search, filterTypeMember
    }:{ page: TableOpt["page"],itemsPerPage: TableOpt["itemsPerPage"],sortBy: TableOpt["sortBy"],search: { fullname: string, phone: string, email: string }, filterTypeMember?: string} ) {
      return new Promise(resolve => {
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage
          const items = dataList.value?.slice().filter(item => {
            if (search.fullname && !item.fullname.toLowerCase().includes(search.fullname.toLowerCase())) {
              return false
            }
            if (search.phone && !item.phone.toLowerCase().includes(search.phone.toLowerCase())) {
              return false
            }
            if (search.email && !item.email.toLowerCase().includes(search.email.toLowerCase())) {
              return false
            }
            if (filterTypeMember && item.membership.level !== filterTypeMember ) {
              return false
            }
            if(item.role === USER_ROLES.ADMIN) {
              return false
            }
            return true
          })
          if (sortBy.length) {
            const sortKey = sortBy[0].key
            const sortOrder = sortBy[0].order
            items?.sort((a:any, b:any) => {
              const aValue = a[sortKey]
              const bValue = b[sortKey]
              return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
            })
          }
          const paginated = items?.slice(start, end === -1 ? undefined : end)
          resolve({ items: paginated, total: items?.length })
        }, 500)
      })
    },
  }

  async function loadItems(opt: TableOpt) {
    loadingTable.value = true
    await getListData()

    const { items, total } = await ListAllApi.fetch({
      page: opt.page,
      itemsPerPage: opt.itemsPerPage,
      sortBy: opt.sortBy,
      search: { fullname: name.value, phone: phone.value, email: email.value },
      filterTypeMember: filterTypeMember.value
    }) as { items: User[]; total: number }

    serverItems.value  = items
    totalItems.value   = total
    loadingTable.value = false
  }

  watch([name,phone,filterTypeMember], () => {
    loadItems(currentTableOptions.value);
  })

  watch(dataList, (newVal) => {
    dataList.value = newVal;
  })

  //actions global
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

  //actions delete
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

  // doi kich hoat
  const { toggleActive } = useToggleActiveStatus(usersAPI.toggleActive, serverItems );

  //getters
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
    itemsPerPage,
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
