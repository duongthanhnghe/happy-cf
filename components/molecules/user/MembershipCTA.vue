<script lang="ts" setup>
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { ROUTES } from '@/shared/constants/routes';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

const { t } = useITranslations()
const storeDisplay = useDisplayStore()

const listPolicy = [
    {
      label: t('membership.text7').text,
      icon: 'crown',
    },
    {
      label: t('membership.text8').text,
      icon: 'paid',
    },
    {
      label: t('membership.text9').text,
      icon: 'celebration',
    },
  ]
</script>

<template>
  <div class="container container-xxl pb-section">
    <div :class="['row row-xs', {'gap-sm': !storeDisplay.isLaptop}]">
      <div class="col-12 col-lg-9">
        <Card :size="storeDisplay.isLaptop ? 'lg':'sm'" class="rd-xl" bg="gray6">
          <Heading :text="t('membership.text6')" size="xl" class="line-height-1d4" />
          <div class="flex flex-wrap gap-sm">
            <Card size="sm" :class="['pd-xs rd-lg', storeDisplay.isLaptop ? 'flex-1':'flex-auto']" bg="primary" v-for="item in listPolicy">
              <NuxtLink :to="{ path: ROUTES.PUBLIC.PAGE.children?.POINT_CLUB.path }" :class="[storeDisplay.isLaptop ? 'flex-direction-column height-full':'align-center', 'flex justify-between']">
                <Heading :size="storeDisplay.isLaptop ? 'lg':'base'" :marginBottom="storeDisplay.isLaptop" :text="item.label" class="white-space-pre" color="white" />
                <div class="text-right">
                  <MaterialIcon :size="storeDisplay.isLaptop ? 'xxl':'xl'" weight="light" :name="item.icon" color="white" class="block" />
                </div>
              </NuxtLink>
            </Card>
          </div>
        </Card>
      </div>
      <div class="col-12 col-lg-3">
        <Card :size="storeDisplay.isLaptop ? 'lg':'sm'" class="rd-xl flex flex-direction-column justify-between height-full" bg="gray6">
          <div>
            <Heading :text="t('membership.text10')" size="xl" class="line-height-1d4" />
            <Text :text="t('membership.text11')" />
          </div>
          <div class="flex gap-sm mt-ms">
            <NuxtLink :to="{ path: ROUTES.PUBLIC.REGISTER.path }" class="flex-1">
              <Button color="black" :label="t('membership.text12').text" class="rd-xl width-full" />
            </NuxtLink>
            <NuxtLink :to="{ path: ROUTES.PUBLIC.PAGE.children?.POINT_CLUB.path }">
              <Button icon="arrow_outward" class="rd-xl" />
            </NuxtLink>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>