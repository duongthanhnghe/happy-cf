import type { Ref } from 'vue';
import { computed, unref } from 'vue';
import { Loading } from '@/utils/global';
import { showSuccess, showWarning } from '@/utils/toast';
import type { MembershipLevels, UpdateMembershipLevels } from '@/server/types/dto/v1/user.dto';
import { usersAPI } from '@/services/v1/admin/users.service';
import { useMembershipList } from '@/composables/admin/user/useAdminMembershipList';
import { useMembershipLevelDetail } from '@/composables/user/useMembershipLevelDetail';
import { useMembershipBenefitList } from '@/composables/user/useMembershipBenefitList';
type MaybeRef<T> = T | Ref<T>;

export const useMembershipOperations = (
  dataList: Ref<MembershipLevels[]>,
  serverItems: Ref<MembershipLevels[]>,
  loadingTable: Ref<boolean>,
  totalItems: Ref<number>,
  defaultForm: MaybeRef<MembershipLevels>,
  formItem: MaybeRef<MembershipLevels>,
  selectedArray: Ref<string[]>,
  isTogglePopupUpdate: Ref<boolean>,
  detailData: Ref<MembershipLevels|null>,
) => {
  const { getMembershipList, fetchMembershipList } = useMembershipList()
  const { getMembershipLevelDetail, fetchMembershipLevelDetail } = useMembershipLevelDetail()
  const { getMembershipBenefitList, fetchMembershipBenefitList } = useMembershipBenefitList()

  const getListData = async () => {
    await fetchMembershipList()

    if(!getMembershipList.value) return
    dataList.value = getMembershipList.value
  }

  const ListAllApi = {
    async fetch({ items }: {
      items: MembershipLevels[],
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
    }) as { items: MembershipLevels[] }

    serverItems.value = items
    if(dataList.value) totalItems.value = dataList.value.length

    loadingTable.value = false
  }

  const handleTogglePopupUpdate = async (value: boolean) => {
    if(getMembershipBenefitList.value.length == 0) await fetchMembershipBenefitList()
    isTogglePopupUpdate.value = value;
  };

  const handleReload = async () => {
    loadItems();
  }

  const handleEdit = async (id:string) => {
    if(!id) return
    await fetchMembershipLevelDetail(id)
    if(getMembershipLevelDetail.value) detailData.value = getMembershipLevelDetail.value
    if(!detailData.value) return
    Object.assign(formItem, detailData.value);
    selectedArray.value = unref(formItem).benefits.map(b => b.id)
    handleTogglePopupUpdate(true);
  }

  async function submitUpdate() {
    if(!detailData.value) return
    const id = detailData.value.id
    if(!id) return

    Loading(true);
    try {
      const bodyData: UpdateMembershipLevels = {
      ...unref(formItem),
      benefits: selectedArray.value,
    }
      if (bodyData.benefits && Array.isArray(bodyData.benefits)) {
        bodyData.benefits = bodyData.benefits.map((b: any) => b.id || b);
      }

      const data = await usersAPI.updateMembershipLevel(id, bodyData)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupUpdate.value = false;
        handleResetForm()
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
    }
    Loading(false);
  }

  const handleResetForm = () => {
    Object.assign(formItem, defaultForm)
  }

  const toggleSelectAll = () => {
    if (likesAllArray.value) {
      selectedArray.value = []
    } else {
      selectedArray.value = getMembershipBenefitList.value.map(b => b.id)
    }
  }

  const likesAllArray = computed(() => {
    return selectedArray.value.length === getMembershipBenefitList.value.length
  })

  const likesSomeSelect = computed(() => {
    return selectedArray.value.length > 0
  })

  return {
    handleTogglePopupUpdate,
    handleEdit,
    getListData,
    loadItems,
    handleReload,
    submitUpdate,
    toggleSelectAll,
    likesAllArray,
    likesSomeSelect,
    getMembershipBenefitList,
  };
};