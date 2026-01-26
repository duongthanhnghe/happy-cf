import { ref } from "vue";
import type { TableHeaders, TableOpt } from "@/server/types";
import type {
  PromotionGiftUsageDTO,
  PromotionGiftUsagePaginationDTO,
} from "@/server/types/dto/v1/promotion-gift-usage.dto";

export const usePromotionGiftUsageState = () => {
  const dataList = ref<PromotionGiftUsagePaginationDTO | null>(null);
  const itemsPerPage = 20;

  const headers = ref<TableHeaders[]>([
    { title: "STT", key: "index", sortable: false },
    { title: "CTKM quà tặng", key: "promotionGiftId", sortable: false },
    { title: "Người dùng", key: "userId", sortable: false },
    { title: "Đơn hàng", key: "orderId", sortable: false },
    { title: "Ngày dùng", key: "usedAt", sortable: false },
    { title: "Hoàn lại", key: "reverted", sortable: false },
    { title: "Ngày hoàn lại", key: "revertedAt", sortable: false },
    { title: "Ngày tạo", key: "createdAt", sortable: false },
  ]);

  const serverItems = ref<PromotionGiftUsageDTO[]>([]);
  const loadingTable = ref<boolean>(true);
  const totalItems = ref<number>(0);

  const searchOrderId = ref<string>("");
  const searchUserId = ref<string>("");
  const searchPromotionGiftId = ref<string>("");
  const reverted = ref<boolean | null>(null);
  const fromDay = ref<string>("");
  const toDay = ref<string>("");

  const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage,
    sortBy: [],
  });

  const detailData = ref<PromotionGiftUsageDTO | null>(null);

  return {
    dataList,
    serverItems,
    loadingTable,
    totalItems,
    headers,
    detailData,
    currentTableOptions,
    itemsPerPage,
    searchOrderId,
    searchUserId,
    searchPromotionGiftId,
    reverted,
    fromDay,
    toDay,
  };
};
