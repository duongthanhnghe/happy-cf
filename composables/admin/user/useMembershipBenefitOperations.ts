import type { Ref } from 'vue';
import { unref } from 'vue';
import { Loading } from '@/utils/global';
import { showConfirm, showSuccess, showWarning } from '@/utils/toast';
import type { CreateMembershipBenefit, MembershipBenefitDTO, UpdateMembershipBenefit } from '@/server/types/dto/v1/user.dto';
import { usersAPI } from '@/services/v1/admin/users.service';
import { useMembershipBenefitList } from '@/composables/user/useMembershipBenefitList';
import { useMembershipBenefitDetail } from '@/composables/user/useMembershipBenefitDetail'
type MaybeRef<T> = T | Ref<T>;

export const useMembershipBenefitOperations = (
  dataList: Ref<MembershipBenefitDTO[]>,
  serverItems: Ref<MembershipBenefitDTO[]>,
  loadingTable: Ref<boolean>,
  totalItems: Ref<number>,
  defaultForm: MaybeRef<CreateMembershipBenefit>,
  formItem: MaybeRef<CreateMembershipBenefit>,
  updateItem: MaybeRef<UpdateMembershipBenefit>,
  isTogglePopupAdd: Ref<boolean>,
  isTogglePopupUpdate: Ref<boolean>,
  detailData: Ref<MembershipBenefitDTO|null>,
) => {

  const { getMembershipBenefitList, fetchMembershipBenefitList } = useMembershipBenefitList()
  const { getMembershipBenefitDetail, fetchMembershipBenefitDetail } = useMembershipBenefitDetail()
 
  const getListData = async () => {
    await fetchMembershipBenefitList()

    if(!getMembershipBenefitList.value) return
    dataList.value = getMembershipBenefitList.value
  }

  const ListAllApi = {
    async fetch({ items }: {
      items: MembershipBenefitDTO[],
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()
          resolve({ items: filtered })
        }, 300)
      })
    },
  }

  async function loadItems() {
    loadingTable.value = true
    await getListData()

    const { items } = await ListAllApi.fetch({
      items: dataList.value || [],
    }) as { items: MembershipBenefitDTO[] }

    serverItems.value = items
    if(dataList.value) totalItems.value = dataList.value.length

    loadingTable.value = false
  }

  const handleTogglePopupAdd = async () => {
    handleResetForm()
    isTogglePopupAdd.value = true;
  }

  const handleTogglePopupUpdate = async (value: boolean) => {
    if(getMembershipBenefitList.value.length == 0) await fetchMembershipBenefitList()
    isTogglePopupUpdate.value = value;
  };

  const handleReload = async () => {
    loadItems();
  }

  async function submitCreate () {
    Loading(true);

    try {
      const newCategory = unref(formItem)

      const data = await usersAPI.createMembershipBenefit(newCategory)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupAdd.value = false;
        handleResetForm()
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  async function submitUpdate() {
    if(!detailData.value) return

    Loading(true);
    try {
      const newCategory = unref(updateItem)

      const data = await usersAPI.updateMembershipBenefit(detailData.value.id, newCategory)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupUpdate.value = false;
        handleResetForm()
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleDelete = async (id: string) => {
    const confirm = await showConfirm('Bạn có chắc xoá mục này?')
    if (!confirm) return

    Loading(true);
    try {
      const data = await usersAPI.deleteMembershipBenefit(id)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleEdit = async (id:string) => {
    if(!id) return
    await fetchMembershipBenefitDetail(id)
    if(getMembershipBenefitDetail.value) detailData.value = getMembershipBenefitDetail.value
    if(!detailData.value) return
    Object.assign(updateItem, detailData.value);
    handleTogglePopupUpdate(true);
  }

  const handleResetForm = () => {
    Object.assign(formItem, defaultForm)
  }

  return {
    handleTogglePopupAdd,
    handleTogglePopupUpdate,
    handleEdit,
    getListData,
    loadItems,
    handleReload,
    submitUpdate,
    submitCreate,
    handleDelete,
    handleResetForm,
  };
};