<script lang="ts" setup>
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { formatCurrency } from '@/utils/global';
const props = defineProps<{
  userId: string;
  balancePoint: number;
}>();
const { t } = useITranslations()
</script>
<template>
  <Card v-if="props.userId" class="rd-xl mt-sm shadow-1">
    <div class="flex gap-xs align-baseline">
      <Text size="md" color="black" weight="semibold" class="mb-sm" :text="t('cart.text7')" />
      <Text color="gray5" :text="`(Bạn đang có ${ formatCurrency(props.balancePoint).replace('đ','') } điểm)`"/>
    </div>
    <CartPointInput classEl="flex gap-sm" :balancePoint="props.balancePoint"/>
  </Card>
</template>