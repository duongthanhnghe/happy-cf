<script lang="ts" setup>
import { useVoucherAll } from '@/composables/voucher/useVoucherAll';
import type { MenuItem } from 'server/types/common/menu-item';
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import { onMounted } from 'vue';

defineProps<{
  listMenu: MenuItem[],
  listMenuLeft: MenuItem[]
}>()

const { fetchVoucherAll, getVoucherDesc } = useVoucherAll();

onMounted(async () => {
  if(getVoucherDesc.value.length === 0) await fetchVoucherAll()
})
</script>

<template>
  <div class="bg-white shadow-2">
    <div class="container container-xxl">
      <div class="flex justify-between align-center">
        <!-- LEFT MENU -->
        <div class="flex gap-ms align-center height-40 overflow-hidden">
          <template v-for="(item, index) in listMenuLeft" :key="index">
            <component
              :is="item.path ? 'router-link' : 'div'"
              :to="item.path ? { path: item.path } : undefined"
              class="flex gap-xs align-center cursor-pointer min-height-40"
              @click="!item.path && item.action?.()"
            >
              <MaterialIcon v-if="index===0" :name="item.icon" size="normal" class="text-color-gray5" />
              <Text limit="1" :text="item.label" class="hover-color-primary" />
            </component>
          </template>

          <client-only>
            <div v-if="getVoucherDesc.length > 0" class="height-25 border-left-default border-color-gray">
            </div>
            <Swiper
              :modules="[Autoplay]"
              direction="vertical"
              :slides-per-view="1"
              :loop="true"
              :autoplay="{
                delay: 2500,
                disableOnInteraction: false,
                reverseDirection: true
              }"
              :allow-touch-move="false"
              class="height-40"
            >
              <SwiperSlide
                v-for="item in getVoucherDesc"
                :key="item.code"
                class="height-40"
              >
                <Text class="hover-color-primary white-space height-40 align-center flex align-center m">
                  <MaterialIcon name="local_activity" size="normal" class="text-color-gray5 mr-xs" />
                  <Text :text="item.description" limit="1" class="max-width-200" weight="medium" />
                </Text>
              </SwiperSlide>
            </Swiper>
          </client-only>
        </div>

        <!-- RIGHT MENU -->
        <div class="flex gap-ms align-center">
          <template v-for="(item, index) in listMenu" :key="index">
            <component
              :is="item.path ? 'router-link' : 'div'"
              :to="item.path ? { path: item.path } : undefined"
              class="flex gap-xs align-center cursor-pointer min-height-40"
              @click="!item.path && item.action?.()"
            >
              <MaterialIcon :name="item.icon" size="normal" class="text-color-gray5" />
              <Text limit="1" :text="item.label" class="hover-color-primary" />
            </component>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
