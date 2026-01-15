<script lang="ts" setup>
import { useOrderHistoryStore } from '@/stores/client/order/useOrderHistoryStore';
import { useOrderStatusStore } from '@/stores/client/order/useOrderStatusStore';
import { useStickyObserver } from "@/utils/stickyObserver"

const store = useOrderHistoryStore();
const storeOrderStatus = useOrderStatusStore();
const { isStuck } = useStickyObserver('tabsSticky')

if(storeOrderStatus.getListData.length === 0) await storeOrderStatus.fetchOrderStatusStore();

</script>
<template>
  <div>
    <v-tabs
      fixed-tabs
      v-model="store.filterStatusOrder"
      :class="['sticky sticky-cover-header', isStuck ? 'bg-gray6':'bg-white rd-lg shadow-1']"
    >
      <v-tab
        v-for="item in [{ id: '', name: 'Tất cả' }, ...storeOrderStatus.getListData]"
        :key="item.id"
        :value="item.id"
        :text="item.name"
      />
    </v-tabs>
    <div id="tabsSticky" />

    <div class="pt-ms pb-ms">
      <LoadingData v-if="store.loadingData && !store.getItems" />
      <template v-else-if="store.getItems?.length">
        <v-infinite-scroll
          height="auto"
          mode="manual"
          @load="store.loadItems"
        >
          <template v-for="item in store.getItems" :key="item.id">
            <OrderItemTemplate1 :item="item" />
          </template>

          <template #load-more="{ props }">
            <Button
              color="secondary"
              label="Xem thêm"
              @click="props.onClick"
            />
          </template>
        </v-infinite-scroll>
      </template>
      <NoData v-else />
    </div>
  </div>

  <PopupOrderDetail />
</template>

