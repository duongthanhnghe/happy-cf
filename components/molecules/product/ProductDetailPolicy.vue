<script lang="ts" setup>
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

const { t } = useITranslations()
const storeDisplay = useDisplayStore();

const listPolicy = [
    {
      label: t('product.detail.policy1').text,
      icon: 'reset_exposure',
    },
    {
      label: t('product.detail.policy2').text,
      icon: 'delivery_truck_speed',
    },
    {
      label: t('product.detail.policy3').text,
      icon: 'phone_in_talk',
    },
    {
      label: t('product.detail.policy4').text,
      icon: 'box',
    },
  ]
</script>

<template>
  <Text :text="t('product.detail.policy5')" align="center" weight="medium" :size="{normal:storeDisplay.isLaptop}" class="text-underline pt-sm pb-sm"/>
  <Card size="xs" class="rd-lg flex flex-wrap" bg="gray6">
    <div class="flex align-center gap-sm width-p50 pd-xs" v-for="item in listPolicy">
      <Button tag="span" color="secondary" :icon="item.icon" class="bg-transparent text-color-primary border-color-gray" />
      <Text size="xs" :text="item.label" />
    </div>
  </Card>
</template>