<script lang="ts" setup>
import type { SocialLinkDTO } from '@/server/types/dto/v1/base-information.dto'

defineProps<{
  phone?: string
  socialLinks?: SocialLinkDTO[]
}>()
</script>

<template>
  <Card size="xs" class="rd-lg mt-sm pl-ms">
    <div class="flex flex-1 align-center justify-between">
      <Text
        text="Hỗ trợ CSKH"
        color="black"
        weight="semibold"
        class="text-uppercase"
      />

      <div class="flex gap-xs">
        <a
          v-if="phone"
          :href="`tel:${Number(phone.replace(/\s+/g, ''))}`"
        >
          <Button tag="span" color="gray" icon="phone" />
        </a>
        <a
          v-if="socialLinks?.length"
          :href="socialLinks.find(link => link.name?.toLowerCase().includes('facebook'))?.src || socialLinks[0].src"
          target="_blank"
        >
          <Button tag="span" color="black" icon="chat" />
        </a>
      </div>
    </div>
  </Card>
</template>
