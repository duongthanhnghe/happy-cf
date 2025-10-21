import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { usersAPI } from "@/services/v1/admin/users.service";
import type { User } from '@/server/types/dto/v1/user.dto'
import type { TableOpt, TableHeaders } from '@/server/types/dto/v1/table-vuetify.dto'
import type { RewardHistoryDTO } from "@/server/types/dto/v1/reward-history.dto";
import { useAdminUserDetail } from '@/composables/user/useAdminUserDetail'
import { useAdminHistoryReward } from '@/composables/user/useAdminHistoryReward'
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";

export const useRewardHistoryStore = defineStore("RewardHistoryAdmin", () => {

  const { getDetailUserApi, fetchDetailUser } = useAdminUserDetail()
  const { getListOrder, fetchListOrder } = useAdminHistoryReward()

  const dataList = ref<RewardHistoryDTO[]>([]);

  const headers = ref<TableHeaders[]>([
    { title: 'OrderCode', key: 'code', sortable: false },
    { title: 'Khach hang', key: 'user', sortable: false, },
    { title: 'Loai', key: 'historyType', sortable: false, },
    { title: 'Diem', key: 'points', sortable: false, },
    { title: 'Thoi gian', key: 'createdAt', sortable: false, },
  ])
    const serverItems = ref<RewardHistoryDTO[]>([])
    const loadingTable = ref<boolean>(true)
    const totalItems = ref<number>(0)
    const name = ref<string>('')
    const phone = ref<string>('')
    const email = ref<string>('')
    const search = ref<string>('')
    const filterTypeReward = ref<string | null>(null)
    const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage: 20,
    sortBy: [],
  })
  const isTogglePopupUpdate = ref<boolean>(false);
  const detailData = ref<RewardHistoryDTO|null>(null);
  const detailUser = ref<User|null>(null);

  const getListData = async () => {
    await fetchListOrder(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage,'')

    if(!getListOrder.value) return
    dataList.value = getListOrder.value.data
    totalItems.value = getListOrder.value.pagination.total
    currentTableOptions.value.page = getListOrder.value.pagination.page
    currentTableOptions.value.itemsPerPage = getListOrder.value.pagination.limit
  }

  const ListAllApi = {
    async fetch({ items, search, filterTypeReward }: {
      items: RewardHistoryDTO[],
      search: { fullname: string, phone: string, email: string },
      filterTypeReward?: string
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()

          if (search.fullname) {
            filtered = filtered.filter(item =>
              item.user?.fullname.toLowerCase().includes(search.fullname.toLowerCase())
            )
          }

          if (search.phone) {
            filtered = filtered.filter(item =>
              item.user?.phone.toLowerCase().includes(search.phone.toLowerCase())
            )
          }

          if (filterTypeReward) {
            filtered = filtered.filter(item => item.historyType === filterTypeReward)
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
      filterTypeReward: filterTypeReward.value || ''
    }) as { items: RewardHistoryDTO[] }

    serverItems.value = items
    if(getListOrder.value) totalItems.value = getListOrder.value.pagination.total

    loadingTable.value = false
  }

  watch([name,phone,filterTypeReward], () => {
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
    if(getDetailUserApi.value) detailUser.value = getDetailUserApi.value
    if(!detailUser.value) return
    handleTogglePopupUpdate(true);
  }

  const { toggleActive } = useToggleActiveStatus(usersAPI.toggleActive, serverItems );

  const resetFilter = () => {
    name.value = ''
    phone.value = ''
    filterTypeReward.value = null
    currentTableOptions.value.page = 1
    currentTableOptions.value.itemsPerPage = 20
  }

  const hasFilter = computed(() => {
    return (
      name.value !== '' ||
      phone.value !== '' ||
      filterTypeReward.value !== null ||
      currentTableOptions.value.page !== 1 ||
      currentTableOptions.value.itemsPerPage !== 20
    )
  })

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
    filterTypeReward,
    hasFilter,
    // actions
    handleTogglePopupUpdate,
    handleEdit,
    getListData,
    loadItems,
    handleReload,
    toggleActive,
    resetFilter,
    //getters
    getDetailUser,
  };
});
