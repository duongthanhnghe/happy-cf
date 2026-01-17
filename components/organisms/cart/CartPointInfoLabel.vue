<script lang="ts" setup>
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { ROUTES } from '@/shared/constants/routes';
import { useBaseInformationStore } from '@/stores/client/base-information/useBaseInformationStore';

const props = defineProps<{
  getTotalPoint: number;
  userId: string|null;
}>();
const { t } = useITranslations()
const storeSetting = useBaseInformationStore();

</script>
<template>
  <Card v-if="storeSetting.getConfigSystem?.reward.enableEarnPoint && props.getTotalPoint !== 0" border class="rd-xl flex justify-between mt-sm cart-point-info-label">
    <template v-if="userId">
      {{ t('point.text1').text }}
      <span  class="flex gap-xs weight-semibold">
        <Button tag="span" size="xs" color="secondary" icon="diamond_shine"/>
        {{ props.getTotalPoint }}
      </span>
    </template>
    <template v-else>
      {{ t('point.text2').text }}
      <NuxtLink  :to="{ path: ROUTES.PUBLIC.LOGIN.path }">
        <Text color="primary" text="Đăng nhập" weight="semibold" class="text-underline" />
      </NuxtLink>
    </template>
  </Card>
</template>