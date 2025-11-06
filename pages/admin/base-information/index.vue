<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue'
import type { SubmitEventPromise } from 'vuetify'
import { useBaseInformationUpdateStore } from '@/stores/admin/setting/useBaseInformationUpdateStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { showWarning } from '@/utils/toast';
import { ROUTES } from '@/shared/constants/routes';
import { useLocationStore } from '@/stores/shared/useLocationStore';
import { nullRules, emailRules } from '@/utils/validation';
import { useLocationWatchers } from '@/composables/shared/location/useLocationWatchers';

definePageMeta({
  layout: ROUTES.ADMIN.BASE_INFORMATION.layout,
  middleware: ROUTES.ADMIN.BASE_INFORMATION.middleware,
})

const storeSettingUpdate = useBaseInformationUpdateStore();
const storeLocation = useLocationStore();
const storeDisplay = useDisplayStore()

const cardItemClass= 'card card-sm bg-white pb-0';

const handleSubmitCreate = async (event: SubmitEventPromise) => {
  const result = await event
  console.log(result)
  if (!result.valid) {
    showWarning('Vui long dien day du thong tin')
    return
  }
  await storeSettingUpdate.update()
}

useLocationWatchers(storeLocation);

onMounted(async () => {
  await storeLocation.fetchProvincesStore()
  const { provinceCode, districtCode, wardCode } = storeSettingUpdate.formItem

  if (provinceCode) {
    storeLocation.selectedProvince = provinceCode
    await storeLocation.fetchDistrictsStore(provinceCode)
  }

  if (districtCode) {
    storeLocation.selectedDistrict = districtCode
    await storeLocation.fetchWardsStore(districtCode)
  }

  if (wardCode) {
    storeLocation.selectedWard = wardCode
  }
})

onBeforeUnmount(() => {
  storeLocation.resetLocation
})

</script>
<template>

<HeaderAdmin />

<v-container>
  <v-form v-if="storeSettingUpdate.formItem.name" validate-on="submit lazy" @submit.prevent="handleSubmitCreate">

      <div :class="`${cardItemClass}`">
        <Heading class="mb-sm" tag="div" weight="semibold" size="md">Thông tin co ban</Heading>
        <div class="row row-xs">
          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="Ten cong ty" required/>
            <v-text-field v-model="storeSettingUpdate.formItem.name" :rules="nullRules" label="Nhap ten cong ty" variant="outlined" required></v-text-field>
          </div>
          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="So dien thoai" required/>
            <v-text-field v-model="storeSettingUpdate.formItem.phone" :rules="nullRules" type="number" label="Nhap so dien thoai" variant="outlined" required></v-text-field>
          </div>
          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="Email" required/>
            <v-text-field v-model="storeSettingUpdate.formItem.email" :rules="emailRules" label="Nhap email" variant="outlined" required></v-text-field>
          </div>
          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="Dia chi" required/>
            <v-text-field v-model="storeSettingUpdate.formItem.address" label="Nhap dia chi" variant="outlined" required></v-text-field>
          </div>
          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="Thoi gian mo cua"/>
            <v-text-field v-model="storeSettingUpdate.formItem.openingHours" label="7:00 - 21:00" variant="outlined"></v-text-field>
          </div>
          <div class="col-12">
            <LabelInput label="Mo ta"/>
            <v-textarea v-model="storeSettingUpdate.formItem.description" label="Nhap mo ta ngan" variant="outlined"></v-textarea>
          </div>
        </div>
      </div>

      <div :class="`${cardItemClass} mt-md`">
        <Heading class="mb-sm" tag="div" weight="semibold" size="md">Mang xa hoi</Heading>
        <div class="row row-xs">
          <div v-if="storeSettingUpdate.formItem.socialLinks" v-for="(item, index) in storeSettingUpdate.formItem.socialLinks" :key="item.name" class="col-12 col-md-6 col-xxl-4">
            <LabelInput :label="item.name"/>
            <v-text-field v-model="storeSettingUpdate.formItem.socialLinks[index].src" :label="`Nhap duong dan `+item.name" variant="outlined"></v-text-field> 
          </div>
        </div>
      </div>

      <div :class="`${cardItemClass} mt-md`">
        <Heading class="mb-sm" tag="div" weight="semibold" size="md">Kho hang</Heading>
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
      </div>

      <div class="flex justify-end mt-md">
        <Button type="submit" color="primary" :shadow="true" label="Luu cai dat" :class="storeDisplay.isMobileTable ? 'w-full':''" />
      </div>
    </v-form>
</v-container>
</template>
