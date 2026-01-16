import { ref } from 'vue';
import type { TableHeaders, TableOpt } from '@/server/types';
import type { User } from '@/server/types/dto/v1/user.dto';

export const useUserManageState = () => {

  const dataList = ref<User[]>([]);
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Ảnh đại diện', key: 'image', sortable: false },
    { title: 'Họ và tên', key: 'fullname', sortable: false },
    { title: 'Email', key: 'email', sortable: false },
    { title: 'Số điện thoại', key: 'phone', sortable: false },
    { title: 'Ngày sinh', key: 'birthday', sortable: false },
    { title: 'Hạng thành viên', key: 'membership', sortable: false },
    { title: 'Trạng thái', key: 'active', sortable: false },
    { title: 'Ngày tham gia', key: 'createdAt', sortable: false },
    { title: 'Thao tác', key: 'actions', sortable: false, headerProps: { class: 'v-data-table-sticky-cl-right' },
      cellProps: { class: 'v-data-table-sticky-cl-right' } },
  ])
    const serverItems = ref<User[]>([])
    const loadingTable = ref<boolean>(true)
    const totalItems = ref<number>(0)
    const search = ref<string>('')
    const filterTypeMember = ref<string|null>(null)
    const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage: 20,
    sortBy: [],
  })

  return {
   dataList,
    serverItems,
    loadingTable,
    totalItems,
    search,
    currentTableOptions,
    filterTypeMember,
    headers,
  };
};