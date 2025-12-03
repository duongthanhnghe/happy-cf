<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { IMAGE_AUTH_LOGIN } from "@/const/image"
import { useRoute } from 'vue-router'
import { ROUTE_HELPERS } from '@/shared/constants/routes-helpers';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import type { CategoryNewsDTO } from "@/server/types/dto/v1/news.dto";

const props = withDefaults(defineProps<{
  list: CategoryNewsDTO[];
  headingCategory?: string;
}>(), {
  
})

const route = useRoute()
const storeDisplay = useDisplayStore()

</script>

<template>
  <Breadcrumb :heading="props.headingCategory ? props.headingCategory : ROUTES.PUBLIC.NEWS.children?.MAIN.label" :image="IMAGE_AUTH_LOGIN">
    <slot>
      <div :class="['flex justify-between gap-ms', storeDisplay.isMobileTable ? 'flex-direction-column' : 'align-end']">
        <div v-if="props.list.length > 0" class="flex gap-sm mt-ms overflow-auto-x scroll-hide white-space">
          <NuxtLink v-if="!props.headingCategory" :to="{ path: ROUTES.PUBLIC.NEWS.children?.MAIN.path }">
            <Button :color="route.fullPath === ROUTES.PUBLIC.NEWS.children?.MAIN.path ? 'black':'secondary'" :label="ROUTES.PUBLIC.NEWS.children?.MAIN.label" />
          </NuxtLink>
          <div v-for="item in props.list" :key="item.id">
            <NuxtLink :to="ROUTE_HELPERS.newsCategory(item.slug)">
              <Button :color="route.path === ROUTE_HELPERS.newsCategory(item.slug) ? 'black':'secondary'" :label="item.categoryName" />
            </NuxtLink>
          </div>
        </div>
        <NewsBoxSearch :class="{'max-width-300': storeDisplay.isLaptop }"/>
      </div>
    </slot>
  </Breadcrumb>
</template>
