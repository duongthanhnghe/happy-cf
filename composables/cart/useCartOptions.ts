import type { Ref } from 'vue';
import type { SelectedOptionPushDTO, SelectedOptionDTO, OptionDTO } from '@/server/types/dto/v1/product.dto';

export const useCartOptions = (
  selectedOptionsData: Ref<SelectedOptionPushDTO[]>,
  tempSelected: Record<string, string>
) => {

  const buildSelectedOptions = (productOptions: OptionDTO[]) => {
    return productOptions.map(option => {
      const selectedVariantId = selectedOptionsData.value[option.id];
      const variant = option.variants.find(v => v.id === selectedVariantId);

      if (!variant) return null;

      return {
        optionName: option.name,
        variantName: variant?.name ?? "",
        variantPrice: variant?.priceModifier ?? 0
      };
    })
    .filter((opt): opt is SelectedOptionPushDTO => opt !== null);
  };

  const clearTempSelected = () => {
    for (const key in tempSelected) delete tempSelected[key];
  };

  const syncTempSelectedFromSelectedOptionsData = (productOptions: OptionDTO[]) => {
    clearTempSelected();
    productOptions.forEach(option => {
      const selected = selectedOptionsData.value.find(o => o.optionName === option.name);
      if (selected) {
        const variant = option.variants.find(v => v.name === selected.variantName);
        if (variant) tempSelected[option.id] = variant.id;
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

    const itemOptions: SelectedOptionPushDTO = {
      optionName,
      variantName,
      variantPrice,
    };

    const existingIndex = selectedOptionsData.value.findIndex(o => o.optionName === optionName);
    if (existingIndex !== -1) {
      selectedOptionsData.value[existingIndex] = itemOptions;
    } else {
      selectedOptionsData.value.push(itemOptions);
    }
  };

  const updateSelectedOptionsData = (newData: SelectedOptionDTO[]) => {
    selectedOptionsData.value = JSON.parse(JSON.stringify(newData));
  };

  return {
    buildSelectedOptions,
    clearTempSelected,
    syncTempSelectedFromSelectedOptionsData,
    setSelectedOptionsData,
    updateSelectedOptionsData,
  };
};