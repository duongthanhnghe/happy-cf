import { ref, watch, reactive } from "vue";
import { defineStore } from "pinia";
import { usersAPI } from "@/services/v1/admin/users.service";
import { Loading } from '@/utils/global'
import type { TableHeaders } from '@/server/types/dto/v1/table-vuetify.dto'
import { showConfirm, showSuccess, showWarning} from '@/utils/toast'
import { useMembershipBenefitList } from '@/composables/user/useMembershipBenefitList'
import { useMembershipBenefitDetail } from '@/composables/user/useMembershipBenefitDetail'
import type { MembershipBenefitDTO, CreateMembershipBenefit, UpdateMembershipBenefit } from '@/server/types/dto/v1/user.dto'

export const useBenefitStore = defineStore("BenefitStore", () => {

  const { getMembershipBenefitList, fetchMembershipBenefitList } = useMembershipBenefitList()
  const { getMembershipBenefitDetail, fetchMembershipBenefitDetail } = useMembershipBenefitDetail()

  const dataList = ref<MembershipBenefitDTO[]>([]);
  const headers = ref<TableHeaders[]>([
    { title: 'Icon', key: 'icon', sortable: false, },
    { title: 'Tên ', key: 'name', sortable: false, },
    { title: 'Mo ta', key: 'description', sortable: false, },
    { title: 'Ngay tao', key: 'createdAt', sortable: false, },
    { title: '', key: 'actions', sortable: false, headerProps: { class: 'v-data-table-sticky-cl-right' },
    cellProps: { class: 'v-data-table-sticky-cl-right' } },
  ])
  
  const serverItems = ref<MembershipBenefitDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const totalItems = ref<number>(0)
  const isTogglePopupUpdate = ref<boolean>(false);
  const isTogglePopupAdd = ref<boolean>(false)
  const detailData = ref<MembershipBenefitDTO|null>(null);
  const page = ref(1);
  const itemsPerPage = ref(20);
  const defaultForm: CreateMembershipBenefit = {
    name: '',
    icon: '',
    description: '',
  };
  const formItem = reactive<CreateMembershipBenefit>({ ...defaultForm} )
  const updateItem = reactive<UpdateMembershipBenefit>({ ...defaultForm, id: '' } )
  
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
      const newCategory = {...formItem}

      const data = await usersAPI.createMembershipBenefit(newCategory)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupAdd.value = false;
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

  async function submitUpdate() {
    if(!detailData.value) return
    const id = detailData.value.id
    if (!id) return
    Loading(true);
    try {
      const newCategory = {...updateItem}

      const data = await usersAPI.updateMembershipBenefit(id, newCategory)
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
        if(dataList.value){
          dataList.value = dataList.value.filter(item => 
            item.id !== id
          )
        }
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
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

  watch([page, itemsPerPage], async () => {
    await loadItems()
  }, {immediate: true})

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
    updateItem,
    isTogglePopupAdd,
    // actions
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
});
