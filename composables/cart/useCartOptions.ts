import type { Ref } from 'vue';
import type { SelectedOptionPushDTO, SelectedOptionDTO, ProductVariantGroupDTO } from '@/server/types/dto/v1/product.dto';

export const useCartOptions = (
  selectedOptionsData: Ref<SelectedOptionPushDTO[]>,
  tempSelected: Record<string, string>,
  priceOptions: Ref<number>,
) => {

  const buildSelectedOptions = (productOptions: ProductVariantGroupDTO[]) => {
    return productOptions.map(option => {
      const selected = selectedOptionsData.value.find(o => o.optionName === option.groupName);

      if (!selected) return null;

      return {
        optionName: option.groupName,
        variantName: selected.variantName,
        variantPrice: selected.variantPrice
      };
    })
    .filter((opt): opt is SelectedOptionPushDTO => opt !== null);
  };

  const clearTempSelected = () => {
    for (const key in tempSelected) delete tempSelected[key];
  };

  const syncTempSelectedFromSelectedOptionsData = (productOptions: ProductVariantGroupDTO[]) => {
    clearTempSelected();

    productOptions.forEach(option => {
      const foundSelected = selectedOptionsData.value.find(o => o.optionName === option.groupName);

      if (foundSelected) {
        const variant = option.selectedVariants.find(v => v.variantName === foundSelected.variantName);
        if (variant) tempSelected[option.groupId] = variant.variantId;
      }
    });
  };

  const setSelectedOptionsData = (
    idOption: string,
    idVariant: string,
    optionName: string,
    variantName: string,
    variantPrice: number
  ) => {
    
    tempSelected[idOption] = idVariant;

    const existIdx = selectedOptionsData.value.findIndex(
      o => o.optionName === optionName
    );

    const newItem: SelectedOptionPushDTO = {
      optionName,
      variantName,
      variantPrice
    };

    if (existIdx >= 0) {
      selectedOptionsData.value[existIdx] = newItem;
    } else {
      selectedOptionsData.value.push(newItem);
    }
  };

  const updateSelectedOptionsData = (newData: SelectedOptionDTO[]) => {
    selectedOptionsData.value = JSON.parse(JSON.stringify(newData));
  };

  const handleSelectVariant = (
    optionId: string,
    variantId: string,
    optionName: string,
    variantName: string,
    variantPrice: number
  ) => {
    tempSelected[optionId] = variantId;
    setSelectedOptionsData(optionId, variantId, optionName, variantName, variantPrice);
    // priceOptions.value = selectedOptionsData.value.reduce(
    //   (total, item) => total + item.variantPrice,
    //   0
    // );
  };

  return {
    buildSelectedOptions,
    clearTempSelected,
    syncTempSelectedFromSelectedOptionsData,
    setSelectedOptionsData,
    updateSelectedOptionsData,
    handleSelectVariant,
  };
};