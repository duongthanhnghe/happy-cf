<script lang="ts" setup>
import MaterialIcon from '@/components/atoms/MaterialIcon.vue';
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import type { VoucherDTO } from '@/server/types/dto/v1/voucher.dto';

const props = withDefaults(defineProps<{
  items?: VoucherDTO[]
  loading?: boolean
}>(), {
  items: () => [],
  loading: false,
})
const { t } = useITranslations()

</script>

<template>
  <div v-if="props.loading && !props.items">Loading...</div>
  <Card v-else size="sm" bg="four" class="rd-lg position-relative" >
    <MaterialIcon name="local_activity" size="xxl" color="white" weight="light" class="position-absolute right-1 opacity-per50" style="font-size: 70px;rotate: 35deg;"/>
    <Text :text="t('voucher.text1')" color="third" weight="semibold" size="normal" class="line-height-1 mb-ms" />
    <div class="flex flex-wrap gap-xs">
      <VoucherItemTemplate2
        v-for="voucher in props.items"
        :key="voucher.code"
        :item="voucher"
      />
    </div>
  </Card>
</template>
