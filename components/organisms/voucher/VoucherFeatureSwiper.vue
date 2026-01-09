<script lang="ts" setup>
import 'swiper/css'
import { useVoucherAll } from '@/composables/voucher/useVoucherAll';
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import { onMounted } from 'vue';

type VoucherPosition = 'top-bar' | 'header-sub'
interface Props {
  position?: VoucherPosition
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top-bar'
})

const { fetchVoucherAll, getVoucherDesc } = useVoucherAll();

onMounted(async () => {
  if(getVoucherDesc.value.length === 0) await fetchVoucherAll()
})
</script>

<template>
  <client-only>
    <div v-if="getVoucherDesc.length > 0 && props.position === 'header-sub'" class="height-25 border-left-default border-color-gray isLaptop">
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
        <Text v-if="props.position === 'header-sub'" class="hover-color-primary white-space height-40 align-center flex align-center gap-xs justify-center">
          <MaterialIcon name="local_activity" size="normal" color="gray5" />
          <Text :text="item.description" limit="1" class="max-width-200" weight="medium" />
        </Text>
        <Text v-else color="white" class="white-space height-40 align-center flex gap-xs align-center justify-center">
          <MaterialIcon name="local_activity" size="normal" color="white" />
          <Text :text="item.description" limit="1" />
        </Text>
      </SwiperSlide>
    </Swiper>
  </client-only>
</template>
