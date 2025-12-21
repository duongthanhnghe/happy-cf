import { unref, type Ref } from 'vue';
import type { SelectedOptionPushDTO } from '@/server/types/dto/v1/product.dto';
type MaybeRef<T> = T | Ref<T>;

export const useCartOptions = (
  selectedOptionsData: Ref<SelectedOptionPushDTO[]>,
  tempSelected: MaybeRef<Record<string, string>>,
  needAutoSelect: Ref<number>,
) => {

  const clearTempSelected = () => {
    for (const key in tempSelected) delete unref(tempSelected)[key];
    needAutoSelect.value++
  };

  const setSelectedOptionsData = (
    idOption: string,
    idVariant: string,
    optionName: string,
    variantName: string,
    variantPrice: number
  ) => {
    
    unref(tempSelected)[idOption] = idVariant;

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

  const handleSelectVariant = (
    optionId: string,
    variantId: string,
    optionName: string,
    variantName: string,
    variantPrice: number
  ) => {
    unref(tempSelected)[optionId] = variantId;
    setSelectedOptionsData(optionId, variantId, optionName, variantName, variantPrice);
  };

 const syncTempSelectedFromCombination = (
    variants: {
      groupId: string
      variantId: string
    }[]
  ) => {
    Object.keys(tempSelected).forEach(k => delete unref(tempSelected)[k])

    variants.forEach(v => {
      unref(tempSelected)[v.groupId] = v.variantId
    })

  }

  return {
    clearTempSelected,
    setSelectedOptionsData,
    handleSelectVariant,
    syncTempSelectedFromCombination,
  };
};