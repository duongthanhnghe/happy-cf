import { ref, computed, watch, reactive, shallowRef } from "vue";
import { defineStore } from "pinia";
import { usersAPI } from "@/services/v1/users.service";
import {
  Loading
} from '@/utils/global'
import type { User } from '@/server/types/dto/v1/user.dto'
import type { TableOpt, TableHeaders } from '@/server/types/dto/v1/table-vuetify.dto'
import {showConfirm, showSuccess, showWarning} from '@/utils/toast'
import { USER_ROLES } from '@/shared/constants/user-roles'
import { useUserDetail } from '@/composables/user/useUserDetail'
import { useUserAll } from '@/composables/user/useUserAll'
import { useMembershipList } from '@/composables/user/useMembershipList'
import { useMembershipBenefitList } from '@/composables/user/useMembershipBenefitList'
import { useMembershipLevelDetail } from '@/composables/user/useMembershipLevelDetail'
import type { MembershipLevels, UpdateMembershipLevels } from '@/server/types/dto/v1/user.dto'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'

export const useMembershipStore = defineStore("MembershipStore", () => {
  const storeFileManage = useFileManageFolderStore();

  const { getMembershipList, fetchMembershipList } = useMembershipList()
  const { getMembershipBenefitList, fetchMembershipBenefitList } = useMembershipBenefitList()
  const { getMembershipLevelDetail, fetchMembershipLevelDetail } = useMembershipLevelDetail()

  const dataList = ref<MembershipLevels[]>([]);
  const headers = ref<TableHeaders[]>([
    { title: 'Ảnh minh họa', key: 'image', sortable: false, },
    { title: 'Tên cấp độ', key: 'name', sortable: false, },
    { title: 'Điểm tối thiểu', key: 'minPoint', sortable: false, },
    { title: 'Icon hiển thị', key: 'icon', sortable: false, },
    { title: 'Loi ich', key: 'benefits', sortable: false, },
    { title: '', key: 'actions', sortable: false, headerProps: { class: 'v-data-table-sticky-cl-right' },
    cellProps: { class: 'v-data-table-sticky-cl-right' } },
  ])
  
  const serverItems = ref<MembershipLevels[]>([])
  const loadingTable = ref<boolean>(true)
  const totalItems = ref<number>(0)
  const isTogglePopupUpdate = ref<boolean>(false);
  const detailData = ref<MembershipLevels|null>(null);
  const page = ref(1);
  const itemsPerPage = ref(20);
  const defaultForm: MembershipLevels = {
    id: '',
    image: '',
    name: '',
    minPoint: 0,
    icon: '',
    benefits: []
  };
  const selectedArray = shallowRef<string[]>([])
  
  const formItem = reactive<MembershipLevels>({ ...defaultForm })
  
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
    selectedArray.value = formItem.benefits.map(b => b.id)
    handleTogglePopupUpdate(true);
  }

  const handleAddImage = () => {
    storeFileManage.handleTogglePopup(true)
  }

  const likesAllArray = computed(() => {
    return selectedArray.value.length === getMembershipBenefitList.value.length
  })

  const likesSomeSelect = computed(() => {
    return selectedArray.value.length > 0
  })

  const toggleSelectAll = () => {
    if (likesAllArray.value) {
      selectedArray.value = []
    } else {
      selectedArray.value = getMembershipBenefitList.value.map(b => b.id)
    }
  }

  async function submitUpdate() {
    if(!detailData.value) return
    const id = detailData.value.id
    if(!id) return

    Loading(true);
    try {
      const bodyData: UpdateMembershipLevels = {
      ...formItem,
      benefits: selectedArray.value,
    }
      if (bodyData.benefits && Array.isArray(bodyData.benefits)) {
        // Chỉ lấy id của benefit
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

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return
    const target = formItem
    target.image = newValue.url
  })

  watch([page, itemsPerPage], async () => {
    await loadItems()
  }, {immediate: true})

  
  // const getDetailUser = computed(() => detailData.value);
  const getMembershipListStore = computed(() => getMembershipBenefitList.value);
  
  return {
    // state
    dataList,
    isTogglePopupUpdate,
    detailData,
    serverItems,
    loadingTable,
    totalItems,
    headers,
    page,
    itemsPerPage,
    formItem,
    selectedArray,
    // actions
    handleTogglePopupUpdate,
    handleEdit,
    getListData,
    loadItems,
    handleReload,
    handleAddImage,
    toggleSelectAll,
    submitUpdate,
    likesSomeSelect,
    likesAllArray,
    getMembershipListStore,
    //getters
    // getDetailUser,
  };
});
