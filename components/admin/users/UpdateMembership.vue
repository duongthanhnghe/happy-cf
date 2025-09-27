<script lang="ts" setup>
import {
  useMembershipStore
} from '@/stores/admin/users/useMembershipStore'
import type { SubmitEventPromise } from 'vuetify'
import { nullRules } from '@/utils/validation';

const store = useMembershipStore();

const handleSubmitUpdate = async (event: SubmitEventPromise) => {
  const results = await event
  if (!results.valid) return
  await store.submitUpdate();
}
</script>
<template>
<Popup popupId="popup-update-membership" v-model="store.isTogglePopupUpdate" popupHeading="Sua level" align="right">
  <template #body>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">
      <div class="portal-popup-footer">
        <Button type="submit" color="primary" label="Cap nhat" class="w-full" />
      </div>

      <LabelInput label="Loi ich thanh vien"/>
        <v-select
          v-model="store.selectedArray"
          :items="store.getMembershipListStore"
          item-title="name"
          item-value="id"
          multiple
          variant="outlined"
        >
          <template v-slot:prepend-item>
            <v-list-item
              title="Chon tat ca"
              @click="store.toggleSelectAll"
            >
              <template v-slot:prepend>
                <v-checkbox-btn
                  :color="store.likesSomeSelect ? 'indigo-darken-4' : undefined"
                  :indeterminate="store.likesSomeSelect && !store.likesAllArray"
                  :model-value="store.likesAllArray"
                ></v-checkbox-btn>
              </template>
            </v-list-item>
          </template>
        </v-select>
        
        <LabelInput label="Tieu de" required/>
        <v-text-field v-model="store.formItem.name" :counter="200" :rules="nullRules" label="Ten" variant="outlined" required></v-text-field>

        <LabelInput label="Diem" required/>
        <v-text-field v-model="store.formItem.minPoint" type="number" :rules="nullRules" label="Ten" variant="outlined" required></v-text-field>

        <LabelInput label="Icon" required/>
        <v-text-field v-model="store.formItem.icon" :rules="nullRules" label="Ten" variant="outlined" required></v-text-field>
        
        <LabelInput label="Anh dai dien" required/>
        <v-img v-if="store.formItem.image" :src="store.formItem.image" class="mb-sm" alt="Hinh anh" />
        <div class="flex gap-sm">
          <v-text-field v-model="store.formItem.image" label="Duong dan anh..." variant="outlined" disabled></v-text-field>
          <Button color="black" :label="store.formItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
        </div>
    </v-form>
  </template>
</Popup>
</template>
