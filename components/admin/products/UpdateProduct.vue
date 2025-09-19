<script lang="ts" setup>
import { useProductManageStore } from '@/stores/admin/product/useProductManageStore'
import type { SubmitEventPromise } from 'vuetify';

const store = useProductManageStore();

const handleSubmitUpdate = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return
  store.submitUpdate()
}

</script>
<template>
<Popup popupId="popup-create-category" v-model="store.isTogglePopupUpdate" popupHeading="Sua san pham" align="right">
  <template #body>
    <v-form  validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">
      <div class="portal-popup-footer">
        <Button type="submit" color="primary" label="Cap nhat" class="w-full" />
      </div>
        <LabelInput label="Ten san pham" required/>
        <v-text-field v-model="store.updateProductItem.productName" :counter="100" :rules="store.nullAndSpecialRules" label="Ten san pham" variant="outlined" required></v-text-field>
        <div class="row">
          <div class="col-6">
        <LabelInput label="Gia goc" required/>
        <v-text-field v-model="store.updateProductItem.price" :rules="store.nullRules" type="number" label="Gia goc" variant="outlined"></v-text-field>
          
          </div>
          <div class="col-6">
        <LabelInput label="Gia khuyen mai" required/>
        <v-text-field v-model="store.updateProductItem.priceDiscounts" :rules="store.productPriceDiscountUpdateRules" type="number" label="Gia khuyen mai" variant="outlined"></v-text-field>
          
          </div>
          <div class="col-6">
        <LabelInput label="So luong" required/>
        <v-text-field v-model="store.updateProductItem.amount" :rules="store.nullRules" type="number" label="So luong" variant="outlined"></v-text-field>
          
          </div>
          <div class="col-6 flex gap-sm align-anchor">
            <div class="flex-1">
              <LabelInput label="Danh muc san pham" required/>
              <v-select label="Chon danh muc"
                v-model="store.updateProductItem.categoryId"
                :items="store.getItemsCategory ? store.getItemsCategory : []"
                item-title="categoryName"
                item-value="id"
                variant="solo"
                :rules="store.nullRules"
              />
              </div>
              <Button icon="add" color="secondary" class="mt-xs" @click.stop.prevent="store.openPopupAddCategory()" />
          </div>
        </div>
        <LabelInput label="Noi dung"/>
        <v-textarea v-model="store.updateProductItem.description" :counter="5000" label="Noi dung" variant="outlined"></v-textarea>
        <LabelInput label="Mo ta"/>
        <v-textarea v-model="store.updateProductItem.summaryContent" :counter="500" label="Mo ta" variant="outlined"></v-textarea>
        <LabelInput label="Anh dai dien" required/>
        <v-img v-if="store.updateProductItem.image" :src="store.updateProductItem.image" class="mb-sm" alt="Hinh anh" :rules="store.nullRules" required/>
        <div class="flex gap-sm">
          <v-text-field v-model="store.updateProductItem.image" label="Duong dan anh..." variant="outlined" disabled></v-text-field>
          <Button color="black" :label="store.updateProductItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
        </div>

        <LabelInput label="Anh lien quan" />

        <div class="row row-sm" v-if="store.updateProductItem.listImage && store.updateProductItem.listImage.length > 0">
          <div class="col-6 col-md-4" v-for="item in store.updateProductItem.listImage" :key="item.id">
            <ControlImage :src="item.src" :label="item.src" className="mb-sm">
              <template #action>
                <Button
                  v-tooltip="'Xoa anh'"
                  color="secondary"
                  icon="delete"
                  size="sm"
                  @click="store.handleDeleteListImage(item.id, false)"
                />
              </template>
            </ControlImage>
          </div>
        </div>

        <Button class="w-full" :border="false" color="gray" label="Them anh" @click.prevent="store.handleAddListImage()"/>


        <v-switch :label="`Tinh trang: ${store.updateProductItem.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.updateProductItem.isActive" inset
        ></v-switch>
    </v-form>
    <Button :label="`${store.updateProductItem.options?.length ? 'Sua bien the':'Them bien the'}`" class="w-full" @click="store.handleTogglePopupAddVariant" />
  </template>
</Popup>
</template>
