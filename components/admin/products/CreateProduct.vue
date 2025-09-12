<script lang="ts" setup>
import { useProductManageStore } from '@/stores/product/useProductManageStore'
import type { SubmitEventPromise } from 'vuetify';
const store = useProductManageStore();

const handleSubmitCreate = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return
  store.submitCreate()
}

</script>
<template>

<Popup popupId="popup-create-product" v-model="store.isTogglePopupAdd" popupHeading="Them san pham" align="right">
  <template #body>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
      <div class="portal-popup-footer">
        <Button type="submit" color="primary" label="Luu moi" class="w-full" />
      </div>
        <LabelInput label="Ten san pham" required/>
        <v-text-field v-model="store.formProductItem.productName" :counter="100" :rules="store.nullAndSpecialRules" label="Nhap ten san pham" variant="outlined" required></v-text-field>
        <div class="row">
          <div class="col-6">
            <LabelInput label="Gia goc" required/>
            <v-text-field v-model="store.formProductItem.price" :rules="store.nullRules" type="number" label="0" variant="outlined"></v-text-field>
          </div>
          <div class="col-6">
            <LabelInput label="Gia khuyen mai" required/>
            <v-text-field v-model="store.formProductItem.priceDiscounts" :rules="store.productPriceDiscountRules" type="number" label="0" variant="outlined"></v-text-field>
          </div>
          <div class="col-6">
            <LabelInput label="So luong" required/>
            <v-text-field v-model="store.formProductItem.amount" :rules="store.nullRules" type="number" label="Nhap so luong" variant="outlined"></v-text-field>
          </div>
          <div class="col-6 flex gap-sm align-anchor">
            <div class="flex-1">
              <LabelInput label="Danh muc san pham" required/>
              <v-select label="Chon danh muc"
                v-model="store.formProductItem.categoryId"
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
        <v-textarea v-model="store.formProductItem.description" :counter="5000" label="Nhap noi dung" variant="outlined"></v-textarea>
        <LabelInput label="Mo ta"/>
        <v-textarea v-model="store.formProductItem.summaryContent" :counter="500" label="Nhap mo ta" variant="outlined"></v-textarea>
        <LabelInput label="Anh dai dien" required/>
        <v-img v-if="store.formProductItem.image" :src="store.formProductItem.image" :rules="store.nullRules" class="mb-sm" alt="Hinh anh" required/>
        <div class="flex gap-sm">
          <v-text-field v-model="store.formProductItem.image" label="Duong dan anh..." variant="outlined" disabled></v-text-field>
          <Button color="black" :label="store.formProductItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
        </div>

        <LabelInput label="Anh lien quan" />

        <div class="row row-sm" v-if="store.formProductItem.listImage && store.formProductItem.listImage.length > 0">
          <div class="col-6 col-md-4" v-for="item in store.formProductItem.listImage" :key="item.id">
            <ControlImage :src="item.src" :label="item.src" className="mb-sm">
              <template #action>
                <Button
                  v-tooltip="'Xoa anh'"
                  color="secondary"
                  icon="delete"
                  size="sm"
                  @click="store.handleDeleteListImage(item.id, true)"
                />
              </template>
            </ControlImage>
          </div>
        </div>

        <Button class="w-full" :border="false" color="gray" label="Them anh" @click.prevent="store.handleAddListImage()"/>

        <v-switch :label="`Tinh trang: ${store.formProductItem.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.formProductItem.isActive" inset
        ></v-switch>
    </v-form>
    <Button type="submit" label="Them bien the" class="w-full" @click.prevent="store.handleTogglePopupAddVariant" />
  </template>
</Popup>
</template>
