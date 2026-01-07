<script lang="ts" setup>
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { ROUTES } from '@/shared/constants/routes'

definePageMeta({
  middleware: ROUTES.PUBLIC.PAGE.children?.FAQ.middleware,
  showBreadcrumb: ROUTES.PUBLIC.PAGE.showBreadcrumb,
  layout: ROUTES.PUBLIC.PAGE.layout,
})

const { t } = useITranslations()

</script>

<template>
  <PageContent :heading="t('page.faq.heading')" :content="t('page.faq.content')"/>
</template>