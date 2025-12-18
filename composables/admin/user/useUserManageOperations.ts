import type { Ref } from 'vue';
import { computed, watch } from 'vue';
import { Loading } from '@/utils/global';
import { showConfirm, showSuccess, showWarning } from '@/utils/toast';
import type { TableOpt } from '@/server/types';
import { useAdminUserAll } from '@/composables/user/useAdminUserAll'
import type { User } from '@/server/types/dto/v1/user.dto';
import { usersAPI } from '@/services/v1/admin/users.service';
import { useToggleActiveStatus } from '@/composables/utils/useToggleActiveStatus';

export const useUserManageOperations = (
  dataList: Ref<User[]>,
  serverItems: Ref<User[]>,
  loadingTable: Ref<boolean>,
  totalItems: Ref<number>,
  search: Ref<string>,
  currentTableOptions: Ref<TableOpt>,
  filterTypeMember: Ref<string|null>,
) => {

  const { getListUserAllApi, fetchListUserAll } = useAdminUserAll()

  const getListData = async () => {
    await fetchListUserAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage, search.value, filterTypeMember.value ?? undefined)

    if(!getListUserAllApi.value) return
    dataList.value = getListUserAllApi.value.data
    totalItems.value = getListUserAllApi.value.pagination.total
    currentTableOptions.value.page = getListUserAllApi.value.pagination.page
    currentTableOptions.value.itemsPerPage = getListUserAllApi.value.pagination.limit
  }

  const ListAllApi = {
    async fetch({ items }: {
      items: User[]
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()

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
    }) as { items: User[] }

    serverItems.value = items
    if(getListUserAllApi.value) totalItems.value = getListUserAllApi.value.pagination.total

    loadingTable.value = false
  }

  watch(
    () => ({
      search: search.value,
      filterTypeMember: filterTypeMember.value,
      page: currentTableOptions.value.page,
      limit: currentTableOptions.value.itemsPerPage,
    }),
    () => {
      loadItems(currentTableOptions.value)
    },
    { deep: true }
  )

  const handleReload = async () => {
    await loadItems(currentTableOptions.value);
  }

  const handleDelete = async (id:string) => {
    const confirm = await showConfirm('Bạn có chắc xoá mục này?')
    if (!confirm) return

    Loading(true)
    try {
      const data =  await usersAPI.delete(id)
      if(data.code === 200){
        showSuccess(data.message)
        handleReload()
      } else showWarning(data.message)
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false)
    }
  }

  const { toggleActive } = useToggleActiveStatus(usersAPI.toggleActive, serverItems.value );
  
  const resetFilter = () => {
    search.value = ''
    filterTypeMember.value = null
    currentTableOptions.value.page = 1
    currentTableOptions.value.itemsPerPage = 20
  }

  const hasFilter = computed(() => {
    return (
      search.value !== '' ||
      filterTypeMember.value !== null ||
      currentTableOptions.value.page !== 1 ||
      currentTableOptions.value.itemsPerPage !== 20
    )
  })

  return {
    handleDelete,
    getListData,
    loadItems,
    handleReload,
    toggleActive,
    resetFilter,
    hasFilter,
  };
};