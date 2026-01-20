<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { MembershipLevels } from '@/server/types/dto/v1/user.dto';
import { formatCurrency } from '@/utils/global';

const props = defineProps<{
  listData: MembershipLevels[],
}>();

const tab = ref<string>('')

watch(() => props.listData, (newVal) => {
    if (newVal && newVal.length > 0 && !tab.value) {
      tab.value = newVal[0].id
    }
  },{ immediate: true }
)

</script>
<template>
  <v-tabs
    v-model="tab"
    fixed-tabs
    class="bg-white sticky"
  >
    <v-tab
      v-for="item in props.listData"
      :key="item.id"
      :value="item.id"
      :text="item.name"
    >
      <Image 
        v-if="item.image"
        :src="item.image"
        :alt="item.name"
        :height="25"
      />
    </v-tab>
  </v-tabs>
  <v-tabs-window v-model="tab">
    <v-tabs-window-item
      v-for="n in props.listData"
      :key="n.id"
      :value="n.id"
    >
      <div class="container pt-ms pb-ms">
        <div>
          <Text :text="n.name" color="black" weight="semibold" size="normal" />
          <Text :text="`Cần ${formatCurrency(n.minPoint, false)} điểm để thăng lên hạng này`" color="gray5" class="mb-ms mt-xs"/>
        </div>
        <div v-for="item in n.benefits" :key="item.id">
          <Card size="xs" class="rd-xs mb-sm border-default">
            <div class="flex gap-sm align-center">
              <div class="bg-gray2 min-width-50 min-height-50 flex align-center justify-center rd-lg">
                <MaterialIcon :name="item.icon" size="xl" color="primary" weight="light" />
              </div>
              {{ item.name }}
            </div>
          </Card>
        </div>
      </div>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

