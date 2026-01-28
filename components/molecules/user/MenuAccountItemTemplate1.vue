<script setup lang="ts">
import { computed } from 'vue';
import type { MenuItem } from '@/server/types/common/menu-item';
import { useRoute } from 'vue-router';
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { ROUTES } from '@/shared/constants/routes';
import { useVoucherAll } from '@/composables/voucher/useVoucherAll';

const props = defineProps<{
  item: MenuItem;
  tag: string;
  isLast?: boolean;
}>();

const route = useRoute();
const storeAccount = useAccountStore()
const { getVoucherAll } = useVoucherAll()

const isLink = computed(() =>
  props.tag === 'NuxtLink' || props.tag === 'RouterLink'
);

const bindProps = computed(() =>
  isLink.value ? { to: props.item.path } : {}
);
</script>


<template>
  <component
    :is="tag"
    v-bind="bindProps"
    @click="!isLink ? item.action?.() : null"
    :class="[
      'flex gap-sm cursor-pointer',
      { 'text-color-primary': route.path === item.path }
    ]"
  >
    <MaterialIcon :name="item.icon" weight="light" size="lg-2" />
    <div :class="['flex flex-1 justify-between align-center',{ 'border-bottom-default pb-ms': !props.isLast }]">
      <span class="flex gap-xs align-center">
        {{ item.label }}
        <v-chip 
          v-if="storeAccount.hasWarningInfo && item.path === ROUTES.PUBLIC.ACCOUNT.children?.INFO.path" 
          size="small" 
          class="pl-0 pr-0 width-md justify-center" 
          color="red"
          v-tooltip.right="'Vui lòng cập nhật thông tin đầy đủ để nhận thêm nhiều ưu đãi'"
        >
          <MaterialIcon name="exclamation" />
        </v-chip>

        <v-chip 
          v-if="getVoucherAll.length > 0 && item.path === ROUTES.PUBLIC.ACCOUNT.children?.WALLET_VOUCHER.path" 
          size="small" 
          class="pl-0 pr-0 width-md justify-center" 
          color="red"
        >
          {{ getVoucherAll.length }}
        </v-chip>
      </span>
      <MaterialIcon name="chevron_right" weight="light" size="lg-2" class="text-color-gray5"/>
    </div>
  </component>
</template>