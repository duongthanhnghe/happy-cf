import { type Ref } from 'vue';
import type { ProductPaginationDTO } from '@/server/types/dto/v1/product.dto';

export const useProductsByFlashSaleOperation = (
  limit: number,
  items: Ref<ProductPaginationDTO|null>,
  flashSaleId: Ref<string|null>,
  getProductsByFlashSale: Ref<ProductPaginationDTO|null>,
  fetchProductsByFlashSale: (flashSaleId: string, page: number, limit: number) => Promise<void>,
  ) => {

  async function load({ done }: { done: (status: 'ok' | 'empty') => void }) {
    if(!items.value || !flashSaleId.value) return

    try {
      const currentPage = items.value.pagination.page
      const totalPages = items.value.pagination.totalPages

      if (currentPage >= totalPages) {
        done('empty')
        return
      }

      const nextPage = currentPage + 1
      await fetchProductsByFlashSale(flashSaleId.value, nextPage, limit)

      if (getProductsByFlashSale.value && getProductsByFlashSale.value.data && getProductsByFlashSale.value.data.length > 0) {
        items.value.data.push(...getProductsByFlashSale.value.data)
        items.value.pagination = getProductsByFlashSale.value.pagination
        done('ok')
      } else {
        done('empty')
      }
    } catch (err) {
      console.error('Error loading more products:', err)
      done('empty')
    }
  }

  return {
   load,
  };
};