<script lang="ts" setup>
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { ROUTES } from '@/shared/constants/routes'

definePageMeta({
  middleware: ROUTES.PUBLIC.PAGE.children?.POLICY_SECURITY.middleware,
  showBreadcrumb: ROUTES.PUBLIC.PAGE.showBreadcrumb,
  layout: ROUTES.PUBLIC.PAGE.layout,
  showMembershipCTA: ROUTES.PUBLIC.PAGE.showMembershipCTA
})

const { t } = useITranslations()

</script>

<template>
  <PageContent :heading="t('page.return.heading')" :content="t('page.return.content')"/>
</template>