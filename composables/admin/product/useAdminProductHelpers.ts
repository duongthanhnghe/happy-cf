import type { ProductDTO } from '@/server/types/dto/v1/product.dto';

export const useAdminProductHelpers = () => {

  const getTotalVariantStock = (item: ProductDTO) => {
    if (item.variantCombinations.length === 0) return item.amount

    return item.variantCombinations.reduce(
      (sum: number, vc: any) => sum + (vc.stock || 0),
      0
    )
  }

  return {
    getTotalVariantStock,
  };
};