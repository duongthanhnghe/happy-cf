<script lang="ts" setup>
import {
  useAddressesManageStore
} from '@/stores/client/users/useAddressesStore'
import type { SubmitEventPromise } from 'vuetify';
import { ADDRESS_TAG } from "@/shared/constants/address-tag";
import { nullRules } from '@/utils/validation';
import { useLocationStore } from '@/stores/shared/useLocationStore';

const store = useAddressesManageStore();
const storeLocation = useLocationStore();

const handleSubmitUpdate = async (event: SubmitEventPromise) => {
    const results = await event
  if (!results.valid) return
  await store.submitUpdate();
}
</script>
<template>
<Popup 
  popupId="popup-update-category" 
  v-model="store.isTogglePopupUpdate" 
  popupHeading="Sua dia chi" 
  footerFixed
  align="right">
  <template #body>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">
        <LabelInput label="Ho va ten" required/>
        <v-text-field v-model="store.formDataItem.fullname" :rules="nullRules" label="Nhap ten danh muc" variant="outlined" required></v-text-field>

        <LabelInput label="So dien thoai" required/>
        <v-text-field v-model="store.formDataItem.phone" :rules="nullRules" label="Nhap ten danh muc" variant="outlined" required></v-text-field>

        <LabelInput label="Dia chi" required/>
        <v-text-field v-model="store.formDataItem.address" :rules="nullRules" label="Nhap ten danh muc" variant="outlined" required></v-text-field>

        <div class="flex gap-sm">
          <div class="flex-1">
          <LabelInput label="Thành phố" required/>
          <v-autocomplete
            v-model="storeLocation.selectedProvince"
              :items="storeLocation.getListProvinces ?? []"
              item-title="PROVINCE_NAME"
              item-value="PROVINCE_ID"
              variant="outlined"
              :rules="nullRules"
            />
          </div>
          <div class="flex-1">
          <LabelInput label="Quan huyen" required/>
            <v-autocomplete
            v-model="storeLocation.selectedDistrict"
              :items="storeLocation.getListDistricts ?? []"
              item-title="DISTRICT_NAME"
              item-value="DISTRICT_ID"
              variant="outlined"
              :rules="nullRules"
            />
          </div>
          <div class="flex-1">
          <LabelInput label="Phuong xa" required/>
          <v-autocomplete
            v-model="storeLocation.selectedWard"
              :items="storeLocation.getListWards ?? []"
              item-title="WARDS_NAME"
              item-value="WARDS_ID"
              variant="outlined"
              :rules="nullRules"
            />
          </div>
        </div>

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
  <template #footer>
    <div class="flex gap-sm">
      <Button v-if="store.detailData" color="gray" label="Xoa" :border="false" class="w-full" @click.prevent="store.handleDelete(store.detailData.id)"/>
      <Button type="submit" color="primary" label="Cap nhat" class="w-full" />
    </div>
  </template>
</Popup>
</template>
