<script lang="ts" setup>
import { useOrderManageStore } from '@/stores/admin/order/useOrderManageStore';
import type { SubmitEventPromise } from 'vuetify'
import { nullRules } from '@/utils/validation';

const store = useOrderManageStore();

const handleSubmit = async (event: SubmitEventPromise) => {
  const results = await event
  if (!results.valid) return
  await store.handleCreateOrderShipping();
}

</script>
<template>
  <Popup
    v-model="store.isTogglePopupCreateShipping"
    popupHeading="Tạo vận đơn"
    align="right"
  >
    <template #body>
      <v-form validate-on="submit lazy" @submit.prevent="handleSubmit">

        <!-- Đơn vị vận chuyển -->
        <LabelInput label="Đơn vị vận chuyển" required />
        <v-select
          v-model="store.formShipping.providerId"
          :items="store.getShippingProviders"
          item-title="name"
          item-value="id"
          :rules="nullRules"
          variant="outlined"
          required
        />

        <!-- Mã vận đơn -->
        <LabelInput label="Mã vận đơn" />
        <v-text-field
          v-model="store.formShipping.trackingCode"
          label="Nhập mã vận đơn"
          variant="outlined"
        />

        <!-- Phí ship -->
        <LabelInput label="Phí vận chuyển" />
        <v-text-field
          v-model.number="store.formShipping.shippingFee"
          type="number"
          label="Nhập phí ship"
          variant="outlined"
        />

        <!-- Footer -->
        <Button
          type="submit"
          color="primary"
          label="Tạo vận đơn"
          class="w-full"
        />

      </v-form>
    </template>
  </Popup>
</template>
