<script lang="ts" setup>
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { ROUTES } from '@/shared/constants/routes'

definePageMeta({
  middleware: ROUTES.PUBLIC.PAGE.children?.POINT_CLUB.middleware,
  layout: ROUTES.PUBLIC.PAGE.layout,
})

const { t } = useITranslations()

</script>

<template>
  <PageContent :heading="t('page.pointclub.heading')" :content="t('page.pointclub.content')"/>
</template>