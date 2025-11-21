<script setup lang="ts">
import '@/styles/molecules/voucher/voucher-item2.scss'
import type { VoucherAvailableDTO } from "@/server/types/dto/v1/voucher.dto";
import { VOUCHER_TYPE } from '@/shared/constants/voucher-type';
import { formatCurrency } from '@/utils/global';

const props = defineProps<{
  item: VoucherAvailableDTO;
}>();

</script>

<template>
  <div class="voucher-item2">
    <img src="/assets/icons/icon-voucher-secondary.svg" width="86" height="26" :alt="item.name" />
    <span v-if="item.type === VOUCHER_TYPE.percentage.type || item.type === VOUCHER_TYPE.product.type" class="voucher-item2-title">
      Giảm {{ props.item.value }}%
    </span>
    <span v-else class="voucher-item2-title">
      Giảm {{ formatCurrency(props.item.value) }}
    </span>
  </div>
</template>