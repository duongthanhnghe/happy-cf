<script lang="ts" setup>
import { useOrderHistoryStore } from '@/stores/client/order/useOrderHistoryStore';
import { useStickyObserver } from "@/utils/stickyObserver"

const store = useOrderHistoryStore();
const { isStuck } = useStickyObserver('tabsSticky')

</script>
<template>
  <div>
    <v-tabs
      fixed-tabs
      v-model="store.filterStatusOrder"
      :class="['sticky sticky-cover-header', isStuck ? 'bg-gray6':'bg-white rd-lg shadow-1']"
    >
      <v-tab
        v-for="item in [{ id: '', name: 'Tất cả' }, ...store.getOrderStatus]"
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
              label="Tải thêm"
              @click="props.onClick"
            />
          </template>
        </v-infinite-scroll>
      </template>
      <NoData v-else />
    </div>
  </div>

  <PopupOrderDetail :typePopup="true" :idOrder="store.idOrderPopupDetail" />
</template>

