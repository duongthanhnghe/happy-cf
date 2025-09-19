<script lang="ts" setup>
import {
  useProductManageStore
} from '@/stores/admin/product/useProductManageStore'
import { showWarning } from '@/utils/toast';
import type { SubmitEventPromise } from 'vuetify';

const store = useProductManageStore();

const handleSubmitCreateOption = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid){
    showWarning('Vui long nhap day du thong tin');
    return
  }
  await store.handleSubmitCreateOption()
}

</script>
<template>
<Popup children popupId="popup-create-variant-product" v-model="store.isTogglePopupAddVariant" popupHeading="Bien the san pham" align="right">
  <template #body>
    <v-form v-model="store.validOptions" validate-on="submit lazy" @submit.prevent="handleSubmitCreateOption">
        <div v-for="(optionItem, index) in store.updateProductItem.id != '' ? store.updateProductItem.options : store.formProductItem.options" :key="index" class="mb-md">
          <Heading v-if="optionItem.name" tag="div" size="md" weight="semibold" class="black mb-xs">
            Nhom: {{ optionItem.name }}
          </Heading>
          <div class="card card-md bg-gray2">
            <div class="flex gap-sm align-anchor ">
              <div class="flex-1">
                <LabelInput label="Ten nhom bien the" required/>
                <v-text-field v-model="optionItem.name" :counter="50" :rules="store.nullRules" label="Nhap ten nhom" variant="outlined" required></v-text-field>
              </div>
              <div>
                <LabelInput label="Bat buoc?"/>
                <v-switch v-model="optionItem.required" class="mt-0" inset></v-switch>
              </div>
              <Button icon="delete" :shadow="true" class="mt-xs" color="black" @click="store.handleRemoveOptionGroup(index)"/>
            </div>
            <div class="mb-md" style="border-bottom: 2px solid #ffffff;"></div>
            <div v-for="(variantItem, indexVariant) in optionItem.variants" :key="indexVariant" class="flex justify-between align-anchor gap-sm">
              <div class="flex-1">
              <LabelInput label="Ten bien the" required/>
              <v-text-field v-model="variantItem.name" :counter="50" :rules="store.nullRules" label="Nhap ten" variant="outlined" required></v-text-field>
              </div>
              <div>
                <LabelInput label="Gia cong them"/>
                <v-text-field v-model="variantItem.priceModifier" type="number" label="0" variant="outlined"></v-text-field>
              </div>
              <div>
                <LabelInput label="InStock"/>
                <v-switch v-model="variantItem.inStock" class="mt-0" inset></v-switch>
              </div>
              <Button icon="delete" color="secondary" class="mt-xs" @click="store.handleRemoveVariant(optionItem.id,variantItem.id)"/>
            </div>
            <div class="flex gap-sm">
            <Button label="Them bien the" icon="add" color="secondary" @click.stop.prevent="store.handleAddVariant(index)"/>
            </div>
          </div>
        </div>
        <div class="portal-popup-footer">
          <Button type="submit" color="primary" :shadow="true" label="Luu bien the" class="w-full" />
        </div>
    </v-form>
    <Button color="black" :shadow="true" label="Them nhom" @click="store.handleAddOptionGroup"/>
  </template>
</Popup>
</template>
