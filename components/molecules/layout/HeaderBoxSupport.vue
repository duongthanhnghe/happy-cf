<script lang="ts" setup>
import type { SocialLinkDTO } from '@/server/types/dto/v1/base-information.dto'

defineProps<{
  phone?: string
  socialLinks?: SocialLinkDTO[]
}>()
</script>

<template>
  <Card class="rd-lg mt-sm">
    <div class="flex flex-1 align-center justify-between">
      <Text
        text="Hỗ trợ CSKH"
        color="black"
        weight="semibold"
        class="text-uppercase"
      />

      <div class="flex gap-sm">
        <a
          v-if="phone"
          :href="`tel:${Number(phone.replace(/\s+/g, ''))}`"
        >
          <Button tag="span" color="gray" size="sm" icon="phone" />
        </a>

        <a
          v-if="socialLinks?.length"
          :href="socialLinks[0].src"
          target="_blank"
        >
          <Button tag="span" color="black" size="sm" icon="chat" />
        </a>
      </div>
    </div>
  </Card>
</template>
