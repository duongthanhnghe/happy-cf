<script lang="ts" setup>
import { useOrderHistoryStore } from '@/stores/order/useOrderHistoryStore';
const store = useOrderHistoryStore();
</script>
<template>
  <Popup
    popupId="popup-list-order"
    v-model="store.isTogglePopupAdd"
    popupHeading="Lịch sử đơn hàng"
    bodyClass="bg-gray2 pd-0"
    align="right"
  >
    <template #body>
      <div class="order-history-body">
        <div class="container pb-sm bg-primary sticky">
          <v-select
            :disabled="!store.getListStatus.length"
            variant="outlined"
            label="Chọn danh mục"
            v-model="store.filterStatusOrder"
            :items="[{ id: '', name: 'Tất cả' }, ...store.getListStatus]"
            item-title="name"
            item-value="id"
            hide-details
          />
        </div>
        <div class="container pb-sm">
          <template v-if="store.getItems?.length">
          <v-infinite-scroll
            height="auto"
            mode="manual"
            @load="store.loadItems"
          >
            <template v-for="item in store.getItems" :key="item.id">
              <OrderItemTemplate1 :item="item" />
            </template>

            <template #load-more="{ props }">
              <template v-if="store.canLoadMore">
                <Button
                  color="secondary"
                  label="Tải thêm"
                  class="mt-sm"
                  @click="props.onClick"
                />
              </template>
            </template>
          </v-infinite-scroll>
          </template>
          <div v-else class="pt-sm no-data">
            <NoData />
          </div>
        </div>
      </div>
    </template>
  </Popup>

  <PopupOrderDetail :typePopup="true" :idOrder="store.getIdOrderPopupDetail" />
</template>

