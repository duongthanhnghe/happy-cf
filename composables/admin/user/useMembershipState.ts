import { reactive, ref, shallowRef } from 'vue';
import type { MembershipLevels } from '@/server/types/dto/v1/user.dto';
import type { TableHeaders } from '@/server/types';

export const useMembershipState = () => {

  const dataList = ref<MembershipLevels[]>([]);
  const headers = ref<TableHeaders[]>([
    { title: 'Hình ảnh minh họa', key: 'image', sortable: false },
    { title: 'Tên cấp thành viên', key: 'name', sortable: false },
    { title: 'Điểm tối thiểu', key: 'minPoint', sortable: false },
    { title: 'Biểu tượng hiển thị', key: 'icon', sortable: false },
    { title: '% tích điểm', key: 'pointRate', sortable: false },
    { title: 'Quyền lợi', key: 'benefits', sortable: false },
    {
      title: 'Thao tác',
      key: 'actions',
      sortable: false,
      headerProps: { class: 'v-data-table-sticky-cl-right' },
      cellProps: { class: 'v-data-table-sticky-cl-right' },
    },
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
    discountRate: 0,
    pointRate: 0,
    benefits: []
  };
  const selectedArray = shallowRef<string[]>([])
  
  const formItem = reactive<MembershipLevels>({ ...defaultForm })

  return {
    defaultForm,
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
  };
};