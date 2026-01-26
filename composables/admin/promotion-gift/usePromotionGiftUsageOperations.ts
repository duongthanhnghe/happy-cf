import type { Ref } from "vue";
import { computed, watch } from "vue";
import type { TableOpt } from "@/server/types";
import { promotionGiftUsageAPI } from "@/services/v1/admin/promotion-gift-usage.services";
import type {
  PromotionGiftUsageDTO,
  PromotionGiftUsagePaginationDTO,
} from "@/server/types/dto/v1/promotion-gift-usage.dto";

export const usePromotionGiftUsageOperations = (
  dataList: Ref<PromotionGiftUsagePaginationDTO | null>,
  serverItems: Ref<PromotionGiftUsageDTO[]>,
  loadingTable: Ref<boolean>,
  totalItems: Ref<number>,

  searchOrderId: Ref<string>,
  searchUserId: Ref<string>,
  searchPromotionGiftId: Ref<string>,
  fromDay: Ref<string>,
  toDay: Ref<string>,
  reverted: Ref<boolean | null>,

  currentTableOptions: Ref<TableOpt>,
  itemsPerPage: number
) => {
  const getListData = async () => {
    const from =
      fromDay.value !== ""
        ? new Date(fromDay.value).toISOString().slice(0, 10)
        : "";

    const to =
      toDay.value !== ""
        ? new Date(toDay.value).toISOString().slice(0, 10)
        : "";

    const res = await promotionGiftUsageAPI.getAll(
      currentTableOptions.value.page,
      currentTableOptions.value.itemsPerPage,
      {
        orderId: searchOrderId.value || undefined,
        userId: searchUserId.value || undefined,
        promotionGiftId: searchPromotionGiftId.value || undefined,
        reverted: reverted.value ?? undefined,
        fromDate: from,
        toDate: to,
      }
    );

    if (res.code !== 0) return;

    dataList.value = res;
    totalItems.value = res.pagination.total;
    currentTableOptions.value.page = res.pagination.page;
    currentTableOptions.value.itemsPerPage = res.pagination.limit;
  };

  const ListAllPromotionGiftUsageApi = {
    async fetch({ items }: { items: PromotionGiftUsageDTO[] }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ items: items.slice() });
        }, 300);
      });
    },
  };

  async function loadItems(opt: TableOpt) {
    loadingTable.value = true;
    await getListData();

    const { items } =
      (await ListAllPromotionGiftUsageApi.fetch({
        items: dataList.value?.data || [],
      })) as { items: PromotionGiftUsageDTO[] };

    serverItems.value = items;
    if (dataList.value?.data)
      totalItems.value = dataList.value.pagination.total;

    loadingTable.value = false;
  }

  watch(
    () => ({
      orderId: searchOrderId.value,
      userId: searchUserId.value,
      promotionGiftId: searchPromotionGiftId.value,
      reverted: reverted.value,
      fromDay: fromDay.value,
      toDay: toDay.value,
      page: currentTableOptions.value.page,
      limit: currentTableOptions.value.itemsPerPage,
    }),
    () => {
      loadItems(currentTableOptions.value);
    },
    { deep: true }
  );

  const resetFilter = () => {
    searchOrderId.value = "";
    searchUserId.value = "";
    searchPromotionGiftId.value = "";
    reverted.value = null;
    fromDay.value = "";
    toDay.value = "";
    currentTableOptions.value.page = 1;
    currentTableOptions.value.itemsPerPage = itemsPerPage;
  };

  const hasFilter = computed(() => {
    return (
      searchOrderId.value !== "" ||
      searchUserId.value !== "" ||
      searchPromotionGiftId.value !== "" ||
      reverted.value !== null ||
      fromDay.value !== "" ||
      toDay.value !== "" ||
      currentTableOptions.value.page !== 1 ||
      currentTableOptions.value.itemsPerPage !== itemsPerPage
    );
  });

  const handleReload = async () => {
    await loadItems(currentTableOptions.value);
  };

  return {
    hasFilter,
    loadItems,
    handleReload,
    resetFilter,
  };
};
