<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useMembershipStore } from '@/stores/shared/useMembershipStore';
import { useAccountStore } from '@/stores/client/users/useAccountStore'

const store = useMembershipStore();
const storeAccount = useAccountStore();

const tab = ref<string>('')

watch(() => store.getListData, (newVal) => {
    if (newVal && newVal.length > 0 && !tab.value) {
      tab.value = newVal[0].id
    }
  },{ immediate: true }
)

</script>
<template>
  <Popup
    popupId="popup-membership-info"
    v-model="storeAccount.isTogglePopupMembershipInformation"
    popupHeading="Hạng thành viên"
    bodyClass="bg-gray2 pd-0"
    align="right"
  >
    <template #body>
      <CardAccount showLevel />

      <LoadingData v-if="store.loading && store.getListData.length === 0" />
      <template v-else>
        <v-tabs
          v-model="tab"
          fixed-tabs
          class="bg-white sticky"
        >
          <v-tab
            v-for="item in store.getListData"
            :key="item.id"
            :value="item.id"
            :text="item.name"
          >
            <img v-if="item.image" :src="item.image" class="max-height-25" />
          </v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item
            v-for="n in store.getListData"
            :key="n.id"
            :value="n.id"
          >
            <div class="container pt-ms pb-ms">
              <div v-for="item in n.benefits" :key="item.id">
                <Card size="xs" class="rd-lg mb-sm shadow-1">
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
    </template>
  </Popup>
</template>

