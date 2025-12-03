<script setup lang="ts">
import { useRoute } from 'vue-router';
import { copyText } from '@/utils/global'
import { useRuntimeConfig } from 'nuxt/app';

const route = useRoute()
const config = useRuntimeConfig()
</script>
<template>
  <div class="flex align-center gap-xs">
    <span>Chia sẻ</span>
    <div class="social-links">
      <NuxtLink :to="`https://www.facebook.com/sharer/sharer.php?u=${config.public.siteUrl+route.fullPath}`" target="_blank">
        <IconFacebook2 />
      </NuxtLink>
      <NuxtLink :to="`https://x.com/intent/tweet?url=${config.public.siteUrl+route.fullPath}`" target="_blank">
        <IconX />
      </NuxtLink>
      <NuxtLink :to="`https://www.linkedin.com/shareArticle?mini=true&url=${config.public.siteUrl+route.fullPath}`" target="_blank">
        <IconLinkedin />
      </NuxtLink>
      <span class="cursor-pointer" @click.prevent="copyText(config.public.siteUrl+route.fullPath)">
        <IconInternet />
      </span>
    </div>
  </div>
</template>
