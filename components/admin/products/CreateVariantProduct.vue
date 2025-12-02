<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { useProductManageStore } from '@/stores/admin/product/useProductManageStore'
import { useVariantGroupStore } from '@/stores/admin/product/useVariantGroupManageStore'
import type { VForm } from 'vuetify/components'
import type { ProductVariantGroupDTO, VariantGroupDTO } from '@/server/types/dto/v1/product.dto';
import { generateSKU } from '@/utils/global';
import { showWarning } from '@/utils/toast';

const productStore = useProductManageStore();
const variantStore = useVariantGroupStore();

const formRef = ref<VForm | null>(null);
const selectedGroups = ref<VariantGroupDTO[]>([]);

const productVariantGroups = reactive<ProductVariantGroupDTO[]>([]);

async function initVariantPopup() {
  productVariantGroups.splice(0);
  selectedGroups.value = [];

  if (variantStore.serverItems.length === 0) {
    await variantStore.loadItemsVariant({ page: 1, itemsPerPage: 100 });
  }

  const variants = productStore.updateProductItem?.variantGroups || [];
  variants.forEach(g => {
    selectedGroups.value.push({ id: g.groupId, groupName: g.groupName } as VariantGroupDTO);
    productVariantGroups.push({
      groupId: g.groupId,
      groupName: g.groupName,
      required: g.required,
      selectedVariants: g.selectedVariants.map(v => ({ ...v }))
    });
  });
}

watch(() => productStore.isTogglePopupAddVariant, async (open) => {
    if (!open) return;
    await initVariantPopup();
  }
);

watch(
  selectedGroups,
  async (newVal, oldVal) => {
    if (!variantStore.serverItems || !variantStore.serverItems.length) return;

    newVal.forEach(group => {
      if (!productVariantGroups.find(g => g.groupId === group.id)) {
        const groupData = variantStore.serverItems.find(v => String(v.id) === group.id);
        if (groupData) {
          productVariantGroups.push({
            groupId: String(groupData.id),
            groupName: groupData.groupName,
            required: true,
            selectedVariants: groupData.variants.map(v => ({
              variantId: String(v.id),
              variantName: v.name,
              priceModifier: 0,
              inStock: true,
              stock: 1,
              sku: generateSKU(productStore.updateProductItem.id, groupData.groupName, v.name)
            }))
          });
        }
      }
    });

    const removed = oldVal?.filter(o => !newVal.some(n => n.id === o.id));
    removed?.forEach(r => {
      const idx = productVariantGroups.findIndex(g => g.groupId === r.id);
      if (idx !== -1) productVariantGroups.splice(idx, 1);
    });
  },
  { deep: true }
);

const handleSubmitVariantProduct = async () => {
  if (!formRef.value) return;

  const valid = await formRef.value.validate();
  if (!valid) {
    showWarning('Vui lòng nhập đầy đủ thông tin');
    return;
  }

  productStore.updateProductItem.variantGroups = productVariantGroups.map(g => ({
    groupId: g.groupId,
    groupName: g.groupName,
    required: g.required,
    selectedVariants: g.selectedVariants.map(v => ({ ...v }))
  }));

  productStore.handleTogglePopupAddVariant(false);
}
</script>

<template>
<Popup children v-model="productStore.isTogglePopupAddVariant" footerFixed popupHeading="Biến thể sản phẩm" align="right">
  <template #body>
    <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="handleSubmitVariantProduct">
     
      <LabelInput label="Chọn nhóm biến thể"/>
      <v-combobox
        v-model="selectedGroups"
        :items="variantStore.serverItems"
        item-title="groupName"
        item-value="id"
        multiple
        chips
        clearable
      />

      <div v-if="productVariantGroups.length > 0" v-for="group in productVariantGroups" :key="group.groupId" class="mb-md">
        <Text v-if="productVariantGroups.length > 0" color="primary" size="normal" :text="`${group.groupName}`" weight="semibold" class="line-height-1 mb-sm"/>
        <Card size="sm" bg="gray6" border class="rd-lg pb-0">
          <div v-for="(variant, idx) in group.selectedVariants" :key="variant.variantId">
            <div class="flex align-center justify-between">
              <Text :text="variant.variantName" weight="semibold" class="mb-xs flex gap-xs" />
              <Text color="gray5" :text="`SKU: ${variant.sku}`" />
            </div>
            <div class="flex gap-sm align-end">
              <div class="flex-1">
                <LabelInput label="Giá cộng thêm"/>
                <v-text-field
                  v-model.number="variant.priceModifier"
                  type="number"
                  variant="outlined"
                />
              </div>
              <div>
                <LabelInput label="Tồn kho"/>
                <v-text-field
                  v-model.number="variant.stock"
                  type="number"
                  variant="outlined"
                />
              </div>
              <div>
                <v-switch v-model="variant.inStock" label="Còn hàng" inset/>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <NoData v-else text="Không có biến thể nào đang được chọn"/>

    </v-form>
  </template>

  <template #footer>
    <Button v-if="productVariantGroups.length > 0" @click="handleSubmitVariantProduct" color="primary" label="Lưu" class="w-full"/>
  </template>
</Popup>
</template>