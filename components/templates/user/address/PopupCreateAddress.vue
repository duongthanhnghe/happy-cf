<script lang="ts" setup>
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore'
import { ADDRESS_TAG } from "@/shared/constants/address-tag";
import { nullRules, phoneRules } from '@/utils/validation';
import { useLocationStore } from '@/stores/shared/useLocationStore';
import type { VForm } from 'vuetify/lib/components';
import { ref } from 'vue';

const store = useAddressesManageStore();
const storeLocation = useLocationStore();
const formRef = ref<VForm | null>(null);

const handleSubmitCreate = async () => {
  if (!formRef.value) return;
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  await store.submitCreate();
}
</script>
<template>
<Popup 
  popupId="popup-create-address" 
  v-model="store.isTogglePopupAdd" 
  popupHeading="Thêm địa chỉ" 
  footerFixed
  align="right">
  <template #body>
    <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
      
        <LabelInput label="Tên người nhận" required/>
        <v-text-field v-model="store.formDataItem.fullname" :rules="nullRules" label="Nhập họ và tên" variant="outlined" required></v-text-field>

        <LabelInput label="Số điện thoại" required/>
        <v-text-field type="tel" v-model="store.formDataItem.phone" :rules="phoneRules" label="Nhập số điện thoại" variant="outlined" required></v-text-field>

        <LabelInput label="Địa chỉ" required/>
        <v-text-field v-model="store.formDataItem.address" :rules="nullRules" label="Nhập địa chỉ" variant="outlined" required></v-text-field>

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
          <LabelInput label="Quận/Huyện" required/>
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
          <LabelInput label="Phường/Xã" required/>
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

        <LabelInput label="Ghi chú"/>
        <v-text-field v-model="store.formDataItem.note" label="Nhập ghi chú" variant="outlined"></v-text-field>
   
        <LabelInput label="Nhãn" required/>
        <v-radio-group inline v-model="store.formDataItem.tag">
          <v-radio :label="ADDRESS_TAG.HOME" :value="ADDRESS_TAG.HOME"></v-radio>
          <v-radio :label="ADDRESS_TAG.OFFICE" :value="ADDRESS_TAG.OFFICE"></v-radio>
          <v-radio :label="ADDRESS_TAG.SCHOOL" :value="ADDRESS_TAG.SCHOOL"></v-radio>
          <v-radio :label="ADDRESS_TAG.OTHER" :value="ADDRESS_TAG.OTHER"></v-radio>
        </v-radio-group>
    </v-form>
  </template>
  <template #footer>
    <Button @click="handleSubmitCreate" color="primary" label="Lưu địa chỉ" class="w-full" />
  </template>
</Popup>
</template>
