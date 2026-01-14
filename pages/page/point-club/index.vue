<script lang="ts" setup>
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { ROUTES } from '@/shared/constants/routes'
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useMembershipStore } from '@/stores/client/users/useMembershipStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

definePageMeta({
  middleware: ROUTES.PUBLIC.PAGE.children?.POINT_CLUB.middleware,
  showBreadcrumb: ROUTES.PUBLIC.PAGE.children?.POINT_CLUB.showBreadcrumb,
  showHeaderSub: ROUTES.PUBLIC.PAGE.children?.POINT_CLUB.showHeaderSub,
  layout: ROUTES.PUBLIC.PAGE.layout,
  showMembershipCTA: ROUTES.PUBLIC.PAGE.showMembershipCTA,
})

const { t } = useITranslations()
const storeDisplay = useDisplayStore()
const storeMembership = useMembershipStore();
const storeAccount = useAccountStore();

const route = useRoute()
const router = useRouter()
const tab = ref<number>(1)

watch(
  () => route.query.tab,
  async (queryTab) => {
    const parsed = Number(queryTab)
    tab.value = [1, 2, 3, 4].includes(parsed) ? parsed : 1

    if (tab.value === 4 && storeMembership.getListData.length === 0) {
      await storeMembership.fetchMembershipStore()
    }
  },
  { immediate: true }
)

watch(tab, (val) => {
  if (Number(route.query.tab) !== val) {
    router.replace({
      query: {
        ...route.query,
        tab: val,
      },
    })
  }
})
</script>

<template>
  <div :class="['bg-white shadow-2']">
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab
          v-for="item in storeAccount.accountMenuInfo"
          :key="item.value"
          :value="item.value"
          class="flex-1 text-color-gray5 min-width-inherit"
        >
          <Text :text="item.label" limit="1" :size="storeDisplay.isLaptop ? 'normal' : 'base'"/>
        </v-tab>
    </v-tabs>
  </div>
  <div class="bg-gray2 overflow-hidden">
    <v-tabs-window v-model="tab" class="overflow-inherit">
      <v-tabs-window-item :value="1">
        <PageContent :heading="t('page.pointclub.heading')" :content="t('page.pointclub.content')"/>
      </v-tabs-window-item>

      <v-tabs-window-item :value="2">
        <PageContent :heading="t('membership.text1')" :content="t('membership.text4')"/>
      </v-tabs-window-item>

      <v-tabs-window-item :value="3">
        <PageContent :heading="t('membership.text2')" :content="t('membership.text5')"/>
      </v-tabs-window-item>
      
      <v-tabs-window-item :value="4">
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