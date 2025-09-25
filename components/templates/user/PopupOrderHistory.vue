<script lang="ts" setup>
import { useOrderHistoryStore } from '@/stores/client/order/useOrderHistoryStore';
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
        <v-tabs
          fixed-tabs
          v-model="store.filterStatusOrder"
          class="bg-white sticky"
        >
          <v-tab
            v-for="item in [{ id: '', name: 'Tất cả' }, ...store.getOrderStatus]"
            :key="item.id"
            :value="item.id"
            :text="item.name"
          />
        </v-tabs>
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

