<script setup lang="ts">
import type { MenuItem } from '@/server/types/common/menu-item';

const props = defineProps<{
  item: MenuItem;
}>();

</script>

<template>
 <router-link :to="{ path: item.path }">
    <Card size="md" class="rd-lg pl-xs pr-xs text-center">
      <div class="flex justify-center">
        <Button :icon="item.icon" color="black" />
      </div>
      <Text :text="item.label" class="mt-xs" limit="1"/>
    </Card>
  </router-link>
</template>