import { reactive, ref } from 'vue';
import type { CreateMembershipBenefit, MembershipBenefitDTO, UpdateMembershipBenefit } from '@/server/types/dto/v1/user.dto';
import type { TableHeaders } from '@/server/types';

export const useMembershipBenefitState = () => {

  const dataList = ref<MembershipBenefitDTO[]>([]);
  const headers = ref<TableHeaders[]>([
    { title: 'Biểu tượng', key: 'icon', sortable: false },
    { title: 'Tên', key: 'name', sortable: false },
    { title: 'Mô tả', key: 'description', sortable: false },
    { title: 'Ngày tạo', key: 'createdAt', sortable: false },
    {
      title: 'Thao tác',
      key: 'actions',
      sortable: false,
      headerProps: { class: 'v-data-table-sticky-cl-right' },
      cellProps: { class: 'v-data-table-sticky-cl-right' },
    },
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
    
  return {
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
    defaultForm,
    isTogglePopupAdd,
  };
};