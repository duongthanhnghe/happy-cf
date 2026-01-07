<script lang="ts" setup>
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { ROUTES } from '@/shared/constants/routes';
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';

const store = useCartStore();
const props = defineProps<{
  userId: string;
  balancePoint: number;
  totalPendingPoints: number;
}>();
const { t } = useITranslations()

</script>
<template>
  <Popup v-model="store.isTogglePopupPoint" :popupHeading="t('cart.text7').text" bodyClass="bg-gray6" footerFixed align="right">
    <template #body >
      <template v-if="props.userId">
        <CardPointInfo v-if="props.balancePoint && props.totalPendingPoints" :balancePoint="props.balancePoint" :totalPendingPoints="props.totalPendingPoints" class="mb-lg"/>

        <div class="mb-xl">
          <CartPointInput classEl="flex flex-direction-column gap-sm" :balancePoint="props.balancePoint" />
        </div>

        <div class="mb-md">
          <Text weight="semibold" color="black" class="text-uppercase" text="Lưu ý" />
          <Text :text="t('cart.text13')" class="list-disc pl-lg"/>
        </div>

        <NuxtLink :to="{ path: ROUTES.PUBLIC.ORDER.path }">
          <Button color="primary" :label="t('cart.text14').text" />
        </NuxtLink>
      </template>
      <NoData v-else :text="t('cart.text16').text"/>
    </template>
  </Popup>
</template>