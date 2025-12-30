import { ref } from "vue";
import type { ProductDTO } from "@/server/types/dto/v1/product.dto";
import type { PaginationMeta } from "@/server/types/common/pagination.dto";

export const useProductMainState = () => {

  const listItems = ref<ProductDTO[]|null>(null);
  const page = ref('1')
  const limit = 12
  const valueChangePage = ref<boolean|null>(null)
  const pagination = ref<PaginationMeta|null>(null)

  return {
    listItems,
    limit,
    page,
    valueChangePage,
    pagination,
  };
};