<script lang="ts" setup>
import type { SubmitEventPromise } from 'vuetify'
import { useSettingUpdateStore } from '@/stores/setting/useSettingUpdateStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { showWarning } from '@/utils/toast';

definePageMeta({
  layout: 'admin-layout',
  middleware: 'admin-role',
})

const storeSettingUpdate = useSettingUpdateStore();
const storeDisplay = useDisplayStore()
const cardItemClass= 'card card-sm bg-white pb-0';

const handleSubmitCreate = async (event: SubmitEventPromise) => {
  const result = await event
  console.log(result)
  if (!result.valid) {
    showWarning('Vui long dien day du thong tin')
    return
  }
  await storeSettingUpdate.updateSetting()
}

</script>
<template>

<HeaderAdmin />

<v-container>
  <v-form v-if="storeSettingUpdate.formItem.name" validate-on="submit lazy" @submit.prevent="handleSubmitCreate">

      <div :class="`${cardItemClass}`">
        <Heading class="mb-sm" tag="div" weight="semibold" size="md">Thông tin co ban</Heading>
        <div class="row row-sm">
          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="Ten cong ty" required/>
            <v-text-field v-model="storeSettingUpdate.formItem.name" :rules="storeSettingUpdate.contentRules" label="Nhap ten cong ty" variant="outlined" required></v-text-field>
          </div>
          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="So dien thoai" required/>
            <v-text-field v-model="storeSettingUpdate.formItem.phone" :rules="storeSettingUpdate.contentRules" type="number" label="Nhap so dien thoai" variant="outlined" required></v-text-field>
          </div>
          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="Email" required/>
            <v-text-field v-model="storeSettingUpdate.formItem.email" :rules="storeSettingUpdate.emailRules" label="Nhap email" variant="outlined" required></v-text-field>
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
        <div class="row row-sm">
          <div v-if="storeSettingUpdate.formItem.socialLinks" v-for="(item, index) in storeSettingUpdate.formItem.socialLinks" :key="item.name" class="col-12 col-md-6 col-xxl-4">
            <LabelInput :label="item.name"/>
            <v-text-field v-model="storeSettingUpdate.formItem.socialLinks[index].src" :label="`Nhap duong dan `+item.name" variant="outlined"></v-text-field> 
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-md">
        <Button type="submit" color="primary" :shadow="true" label="Luu cai dat" :class="storeDisplay.isMobileTable ? 'w-full':''" />
      </div>
    </v-form>
</v-container>
</template>
