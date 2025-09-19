<script lang="ts" setup>
import {
  useAddressesManageStore
} from '@/stores/client/users/useAddressesStore'
import type { SubmitEventPromise } from 'vuetify';
import { ADDRESS_TAG } from "@/shared/constants/address-tag";

const store = useAddressesManageStore();

const handleSubmitUpdate = async (event: SubmitEventPromise) => {
    const results = await event
  if (!results.valid) return
  await store.submitUpdate();
}
</script>
<template>
<Popup children popupId="popup-update-category" v-model="store.isTogglePopupUpdate" popupHeading="Sua dia chi" align="right">
  <template #body>
    <v-form v-model="store.valid" validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">
      <div class="portal-popup-footer flex gap-sm">
        <Button v-if="store.detailData" color="gray" label="Xoa" :border="false" class="w-full" @click.prevent="store.handleDelete(store.detailData.id)"/>
        <Button type="submit" color="primary" label="Cap nhat" class="w-full" />
      </div>
        <LabelInput label="Ho va ten" required/>
        <v-text-field v-model="store.formDataItem.fullname" :rules="store.titleRules" label="Nhap ten danh muc" variant="outlined" required></v-text-field>

        <LabelInput label="So dien thoai" required/>
        <v-text-field v-model="store.formDataItem.phone" :rules="store.titleRules" label="Nhap ten danh muc" variant="outlined" required></v-text-field>

        <LabelInput label="Dia chi" required/>
        <v-text-field v-model="store.formDataItem.address" :rules="store.titleRules" label="Nhap ten danh muc" variant="outlined" required></v-text-field>

        <LabelInput label="Ghi chu"/>
        <v-text-field v-model="store.formDataItem.note" label="Nhap ten danh muc" variant="outlined"></v-text-field>
   
        <LabelInput label="Nhan" required/>
        
        <v-radio-group inline v-model="store.formDataItem.tag">
          <v-radio :label="ADDRESS_TAG.HOME" :value="ADDRESS_TAG.HOME"></v-radio>
          <v-radio :label="ADDRESS_TAG.OFFICE" :value="ADDRESS_TAG.OFFICE"></v-radio>
          <v-radio :label="ADDRESS_TAG.SCHOOL" :value="ADDRESS_TAG.SCHOOL"></v-radio>
          <v-radio :label="ADDRESS_TAG.OTHER" :value="ADDRESS_TAG.OTHER"></v-radio>
        </v-radio-group>

        <v-switch :label="`Dia chi ${store.formDataItem.isDefault ? 'mac dinh':'lua chon'}`" class="mt-0" v-model="store.formDataItem.isDefault" inset
        ></v-switch>
    </v-form>
  </template>
</Popup>
</template>
