<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { ROUTES } from "@/shared/constants/routes";
import { formatDateTime } from "@/utils/global";

import { usePromotionGiftUsageManageStore } from "@/stores/admin/promotion-gift/usePromotionGiftUsageManageStore";
import { useAdminUserDetailStore } from "@/stores/admin/users/useUserDetailStore";
import { useAdminOrderDetailStore } from "@/stores/admin/order/useOrderDetailStore";

definePageMeta({
  layout: ROUTES.ADMIN.PROMOTION_GIFT.children?.USAGE.layout,
  middleware: ROUTES.ADMIN.PROMOTION_GIFT.children?.USAGE.middleware,
});

const store = usePromotionGiftUsageManageStore();
const storeDetailOrder = useAdminOrderDetailStore();
const storeDetailUser = useAdminUserDetailStore();

onBeforeUnmount(() => {
  store.resetFilter();
});
</script>

<template>
  <HeaderAdmin>
    <template #left>
      <v-text-field
        v-model="store.searchInput" 
        placeholder="Mã CTKM, Order, User..."
        variant="outlined"
        hide-details
        clearable
        @keyup.enter="store.handleSearch"
        @click:clear="store.handleSearch(false)"
      />

      <v-select
        v-model="store.reverted"
        label="Trạng thái"
        :items="[
          { label: 'Tất cả', value: null },
          { label: 'Chưa hoàn', value: false },
          { label: 'Đã hoàn', value: true },
        ]"
        item-title="label"
        item-value="value"
        variant="outlined"
        hide-details
      />

      <DateFilter
        v-model:fromDay="store.fromDay"
        v-model:toDay="store.toDay"
      />

      <Button
        v-if="store.hasFilter"
        color="black"
        size="md"
        icon="filter_alt_off"
        @click="store.resetFilter()"
      />
    </template>
  </HeaderAdmin>

  <AdminPopupOrderDetail />
  <DetailAccount />

  <v-container>
    <v-data-table-server
      class="elevation-0"
      v-model:items-per-page="store.itemsPerPage"
      :headers="store.headers"
      :items="store.serverItems"
      :items-length="store.totalItems"
      :loading="store.loadingTable"
      :items-per-page-options="[20, 50, 100, 200]"
      item-value="name"
      @update:options="options => {
        store.currentTableOptions = options;
      }"
    >
      <template #item.index="{ index }">
        {{ index + 1 }}
      </template>

      <template #item.promotionGiftId="{ item }">
        <Text :text="item.promotionGiftId?.name" color="black" weight="medium" />
        <Text :text="'ID: '+item.promotionGiftId?._id" color="gray5" />
      </template>

      <template #item.userId="{ item }">
        <div v-if="item.userId" class="flex gap-sm align-center">
          <Button
            color="gray"
            size="sm"
            icon="person"
            @click="storeDetailUser.handleTogglePopup(true, item.userId._id)"
          />
          <div>
            <div>{{ item.userId.fullname }}</div>
            <Text :text="item.userId.phone" color="gray5" />
          </div>
        </div>
        <span v-else class="text-color-gray5">Khách vãng lai</span>
      </template>

      <template #item.orderId="{ item }">
        <div
          class="flex gap-sm align-center cursor-pointer"
          @click="storeDetailOrder.handleTogglePopupDetail(true, item.orderId._id)"
        >
          <Button
            color="gray"
            size="sm"
            icon="visibility"
            v-tooltip="'Xem chi tiết đơn hàng'"
          />
          Chi tiết
        </div>
      </template>

      <template #item.usedAt="{ item }">
        {{ formatDateTime(item.usedAt, "vi-VN") }}
      </template>

      <template #item.reverted="{ item }">
        <v-chip
          :color="item.reverted ? 'orange' : 'green'"
          label
        >
          {{ item.reverted ? "Đã hoàn" : "Đang áp dụng" }}
        </v-chip>
      </template>

      <template #item.revertedAt="{ item }">
        <span v-if="item.revertedAt">
          {{ formatDateTime(item.revertedAt, "vi-VN") }}
        </span>
      </template>

      <template #item.createdAt="{ item }">
        {{ formatDateTime(item.createdAt, "vi-VN") }}
      </template>
    </v-data-table-server>
  </v-container>
</template>
