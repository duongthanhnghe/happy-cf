<script lang="ts" setup>
import type { VoucherDTO } from '@/server/types/dto/v1/voucher.dto';

const props = withDefaults(defineProps<{
  items?: VoucherDTO[]
  loading?: boolean
}>(), {
  items: () => [],
  loading: false,
})

</script>

<template>
  <div v-if="props.loading && props.items.length === 0">Loading...</div>
  <div class="flex gap-sm overflow-auto" v-else>
    <VoucherItemTemplate1
      v-for="voucher in props.items"
      :key="voucher.code"
      :item="voucher"
    />
  </div>
</template>
