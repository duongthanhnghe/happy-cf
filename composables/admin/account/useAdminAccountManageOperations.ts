import { showWarning, showSuccess, showConfirm } from "@/utils/toast";
import { unref, watch, type Ref } from 'vue';
import { Loading } from "@/utils/global";
import { accountAPI } from "@/services/v1/admin/account.service";
import type { AccountCreateDTO, AccountDTO, AccountRoleType } from "@/server/types/dto/v1/account.dto";
import { useAccountAll } from "./useAccountAll";
import { useForbiddenHandler } from "@/utils/handle403";
import type { TableOpt } from "@/server/types";
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
type MaybeRef<T> = T | Ref<T>;

export const useAdminAccountManageOperations = (
  defaultForm: MaybeRef<AccountCreateDTO>,
  formCreate: MaybeRef<AccountCreateDTO>,
  dataList: Ref<AccountDTO[]>,
  serverItems: Ref<AccountDTO[]>,
  loadingTable: Ref<boolean>,
  totalItems: Ref<number>,
  search: Ref<string>,
  filterTypeMember: Ref<AccountRoleType|null>,
  currentTableOptions: Ref<TableOpt>,
  newPassword: Ref<string>,
  isTogglePopupCreate: Ref<boolean>,
) => {

    const { getListAccountAllApi, fetchListAccountAll } = useAccountAll()
    const { handleForbiddenAccess } = useForbiddenHandler();

    const getListData = async () => {
      await fetchListAccountAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage,search.value,filterTypeMember.value)

      if(!getListAccountAllApi.value) return
      dataList.value = getListAccountAllApi.value.data
      totalItems.value = getListAccountAllApi.value.pagination.total
      currentTableOptions.value.page = getListAccountAllApi.value.pagination.page
      currentTableOptions.value.itemsPerPage = getListAccountAllApi.value.pagination.limit
    }

    const ListAllApi = {
      async fetch({ items }: {
        items: AccountDTO[],
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
      }) as { items: AccountDTO[] }

      serverItems.value = items
      if(getListAccountAllApi.value) totalItems.value = getListAccountAllApi.value.pagination.total

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
        loadItems(currentTableOptions.value);
      },
      { deep: true }
    )

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
          handleReload()
        } else showWarning(data.message)
      } catch (err) {
        console.error('Error submitting form:', err)
      } finally {
        Loading(false)
      }
    }

    const handleResetPassword = async (email: string) => {
      const confirm = await showConfirm('Reset mat khau cho email ' + email + ' la: ' + newPassword.value + '')
      if (!confirm) return

      if(!email) return
      Loading(true)
      try {
        const res = await accountAPI.resetPassword(email, newPassword.value);
        if (res.code === 403) {
          handleForbiddenAccess(res.message);
          return;
        }
        showSuccess(res.message);
      } catch (err: any) {
        console.log(err.message);
      } finally {
        Loading(false)
      }
    };

    async function submitCreate() {
      Loading(true);
      try {
        const bodyData = {...unref(formCreate)}

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
      } catch (err: any) {
        console.error('Error submitting form:', err)
      } finally {
        Loading(false)
      }
    }

    const handleCreate = () => {
      isTogglePopupCreate.value = true;
    }

    const { toggleActive } = useToggleActiveStatus(accountAPI.toggleActive, serverItems );

  return {
    handleDelete,
    getListData,
    loadItems,
    handleReload,
    toggleActive,
    handleResetPassword,
    submitCreate,
    handleCreate,
  };
};