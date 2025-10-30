<script lang="ts" setup>
import { useOrderHistoryStore } from '@/stores/client/order/useOrderHistoryStore';
const store = useOrderHistoryStore();
</script>
<template>
  <div>
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
    <div class="container pt-ms pb-ms">
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
                @click="props.onClick"
              />
            </template>
          </template>
        </v-infinite-scroll>
      </template>
      <div v-else>
        <NoData />
      </div>
    </div>
  </div>

  <PopupOrderDetail :typePopup="true" :idOrder="store.getIdOrderPopupDetail" />
</template>

