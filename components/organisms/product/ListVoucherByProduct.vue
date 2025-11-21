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
  <div class="flex align-center gap-sm mt-ms" v-else>
    <Text text="Mã giảm giá" color="gray5" />
    <div class="flex flex-wrap gap-xs">
      <VoucherItemTemplate2
        v-for="voucher in props.items"
        :key="voucher.code"
        :item="voucher"
      />
    </div>
  </div>
</template>
