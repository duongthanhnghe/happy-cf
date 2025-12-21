<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { useProductManageStore } from '@/stores/admin/product/useProductManageStore'
import { useVariantGroupStore } from '@/stores/admin/product/useVariantGroupManageStore'
import type { VForm } from 'vuetify/components'
import type { ProductVariantGroupDTO, VariantGroupDTO } from '@/server/types/dto/v1/product.dto';
import { generateSkuVariant } from '@/utils/global';
import { showWarning } from '@/utils/toast';
import { nullRules } from '@/utils/validation';
import type { ProductVariantCombinationDTO } from "@/server/types/dto/v1/product.dto"; 

const productStore = useProductManageStore();
const variantStore = useVariantGroupStore();

const formRef = ref<VForm | null>(null);
const selectedGroups = ref<VariantGroupDTO[]>([]);
const isInitPopup = ref(false)

const productVariantGroups = reactive<ProductVariantGroupDTO[]>([]);
const variantCombinations = ref<ProductVariantCombinationDTO[]>([]);

async function initVariantPopup() {
  isInitPopup.value = true

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
      options: g.options.map(o => ({
      variantId: o.variantId,
      variantName: o.variantName
    }))
    });
  });

  variantCombinations.value =
  productStore.updateProductItem?.variantCombinations
    ? [...productStore.updateProductItem.variantCombinations]
    : []

  isInitPopup.value = false
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
            options: groupData.variants.map(v => ({
              variantId: String(v.id),
              variantName: v.name
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

function buildVariantCombinations() {
  if (!productVariantGroups.length) {
    variantCombinations.value = []
    return
  }

  const oldMap = new Map(
    variantCombinations.value.map(v => [v.sku, v])
  )

  const groups = productVariantGroups.map(g => ({
    groupId: g.groupId,
    groupName: g.groupName,
    options: g.options
  }))

  const result: ProductVariantCombinationDTO[] = []

  function backtrack(index: number, current: any[]) {
    if (index === groups.length) {
      const sku = generateSkuVariant(
        productStore.updateProductItem.sku,
        current
      )

      const old = oldMap.get(sku)

      result.push({
        id: old?.id ?? '',
        sku,
        priceModifier: old?.priceModifier ?? 0,
        stock: old?.stock ?? 0,
        inStock: old?.inStock ?? true,
        image: old?.image ?? '',
        variants: current
      })
      return
    }

    for (const opt of groups[index].options) {
      backtrack(index + 1, [
        ...current,
        {
          groupId: groups[index].groupId,
          groupName: groups[index].groupName,
          variantId: opt.variantId,
          variantName: opt.variantName
        }
      ])
    }
  }

  backtrack(0, [])
  variantCombinations.value = result
}

watch(
  productVariantGroups,
  () => {
    if (isInitPopup.value) return
    buildVariantCombinations()
  },
  { deep: true }
)

const handleSubmitVariantProduct = async () => {
  if (!formRef.value) return

  const { valid } = await formRef.value.validate()
  if (!valid) {
    showWarning('Vui lòng nhập đầy đủ thông tin')
    return
  }

  productStore.updateProductItem.variantGroups = productVariantGroups.map(g => ({
    groupId: g.groupId,
    groupName: g.groupName,
    required: g.required,
    options: g.options
  }))

  productStore.updateProductItem.variantCombinations = variantCombinations.value

  productStore.handleTogglePopupAddVariant(false)
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

      <div v-if="variantCombinations.length">
        <Text color="primary" size="normal" text="Danh sách biến thể" weight="semibold" class="line-height-1 mb-sm"/>
        <Card
          v-for="combo in variantCombinations"
          :key="combo.sku"
          size="sm"
          bg="gray6"
          border
          class="rd-lg mb-md"
        >
          <!-- Tên biến thể -->
          <div class="flex align-center justify-between mb-xs">
            <Text
              :text="combo.variants.map(v => v.variantName).join(' / ')"
              weight="semibold"
            />
            <Text color="gray5" :text="`SKU: ${combo.sku}`" />
          </div>

          <!-- Giá + tồn -->
          <div class="flex gap-sm align-end">
            <div class="flex-1">
              <LabelInput label="Giá" required />
              <v-text-field
                v-model.number="combo.priceModifier"
                type="number"
                variant="outlined"
                :rules="nullRules"
                required
              />
            </div>

            <div>
              <LabelInput label="Tồn kho" required />
              <v-text-field
                v-model.number="combo.stock"
                type="number"
                variant="outlined"
                :rules="nullRules"
                required
              />
            </div>

            <div>
              <v-switch
                v-model="combo.inStock"
                label="Hiển thị"
                inset
              />
            </div>
          </div>

          <!-- Ảnh SKU -->
          <div class="flex align-start gap-sm">
            <img
              v-if="combo.image"
              :src="combo.image"
              alt="Ảnh SKU"
              class="width-70 object-fit-cover rd-xs"
            />
            <div class="flex-1">
              <LabelInput label="Ảnh đại diện" />
              <v-text-field
                v-model="combo.image"
                type="text"
                variant="outlined"
                hide-details
              />
            </div>
          </div>
        </Card>
      </div>
      <NoData v-else text="Không có biến thể nào đang được chọn"/>

    </v-form>
  </template>

  <template #footer>
    <div class="flex gap-sm">
      <Button v-if="variantCombinations.length" @click.prevent="productStore.handleTogglePopupAddVariant(false)" color="gray" label="Huy thay doi" class="w-full"/>
      <Button @click="handleSubmitVariantProduct" color="primary" label="Lưu" class="w-full"/>
    </div>
  </template>
</Popup>
</template>