import { ref } from 'vue';
import type { TableHeaders } from '@/server/types';
import type { PaymentDTO } from '@/server/types/dto/v1/order.dto';

export const usePaymentMethodState = () => {

  const dataList = ref<PaymentDTO[]>([]);
  const headers = ref<TableHeaders[]>([
    { title: 'Hình ảnh', key: 'image', sortable: false },
    { title: 'Tên phương thức', key: 'name', sortable: false },
    { title: 'Mã phương thức', key: 'method', sortable: false },
    { title: 'Mô tả', key: 'description', sortable: false },
    { title: 'Trạng thái', key: 'isActive', sortable: false },
  ])
  const serverItems = ref<PaymentDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const totalItems = ref<number>(0)
  const page = ref(1);
  const itemsPerPage = ref(20);
  
  return {
    dataList,
    serverItems,
    loadingTable,
    totalItems,
    headers,
    page,
    itemsPerPage,
  };
};