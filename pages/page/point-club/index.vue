<script lang="ts" setup>
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { ROUTES } from '@/shared/constants/routes'
import { useMembershipStore } from '@/stores/client/users/useMembershipStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { ref, watchEffect } from 'vue';

definePageMeta({
  middleware: ROUTES.PUBLIC.PAGE.children?.POINT_CLUB.middleware,
  showBreadcrumb: ROUTES.PUBLIC.PAGE.children?.POINT_CLUB.showBreadcrumb,
  showHeaderSub: ROUTES.PUBLIC.PAGE.children?.POINT_CLUB.showHeaderSub,
  layout: ROUTES.PUBLIC.PAGE.layout,
})

const { t } = useITranslations()
const storeDisplay = useDisplayStore()
const storeMembership = useMembershipStore();

const tab = ref<number|null>(null)
const tabs = [
  { value: 'tab1', label: t('page.pointclub.heading').text },
  { value: 'tab2', label: t('membership.text1').text },
  { value: 'tab3', label: t('membership.text2').text },
  { value: 'tab4', label: t('membership.text3').text },
]

watchEffect(async() => {
  if (tab.value === 4 && storeMembership.getListData.length === 0) await storeMembership.fetchMembershipStore()
})

</script>

<template>
  <div :class="['bg-white shadow-2']">
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab
          v-for="item in tabs"
          :key="item.value"
          :value="item.value"
          class="flex-1 text-color-gray5"
        >
          <Text :text="item.label" limit="1" :size="storeDisplay.isLaptop ? 'normal' : 'base'"/>
        </v-tab>
    </v-tabs>
  </div>
  <div class="bg-gray2">
    <v-tabs-window v-model="tab" class="overflow-inherit">
      <v-tabs-window-item value="tab1">
        <PageContent :heading="t('page.pointclub.heading')" :content="t('page.pointclub.content')"/>
      </v-tabs-window-item>
      <v-tabs-window-item value="tab2">
        <PageContent :heading="t('membership.text1')" :content="t('membership.text4')"/>
      </v-tabs-window-item>
      <v-tabs-window-item value="tab3">
        <PageContent :heading="t('membership.text2')" :content="t('membership.text5')"/>
      </v-tabs-window-item>
      <v-tabs-window-item value="tab4">
        <div class="container pt-section pb-section">
          <Heading text="Lợi ích" size="xxl" align="center" />
          <Card size="lg" class="rd-lg pd-0 overflow-hidden">
            <ListMembershipInfo :listData="storeMembership.getListData" />
          </Card>
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>

</template>