import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto'
import { useProductCategoryTree } from '@/composables/product/useProductCategoryTree';
import { ROUTE_HELPERS } from "@/shared/constants/routes-helpers";
import type { MenuItem } from "@/server/types/common/menu-item";

export const useProductCategoryStore = defineStore("ProductCategoryStore", () => {
  const { getListCategoryTree, fetchCategoryListTree } = useProductCategoryTree();

  const dataList = ref<CategoryProductDTO[]>([])
  const loading = ref(false)

  const fetchCategoryStore = async () => {
    if (dataList.value.length > 0) return

    loading.value = true
    try {
      await fetchCategoryListTree()
      dataList.value = getListCategoryTree.value
    } finally {
      loading.value = false
    }
  }

  const getListData = computed(() => dataList.value);

  const getFlatCategoryList = computed(() => {
    const result: CategoryProductDTO[] = [];

    const flatten = (nodes: CategoryProductDTO[]) => {
      nodes.forEach(node => {
        result.push(node);
        if (node.children?.length) {
          flatten(node.children);
        }
      });
    };

    flatten(dataList.value);
    return result;
  });

  const mapCategoryToMenu = (category: any): MenuItem => {
    return {
      label: category.categoryName,
      path: ROUTE_HELPERS.productCategory(category.slug),
      icon: category.image,
      children: category.children?.length
        ? category.children.map((child: any) => mapCategoryToMenu(child))
        : undefined
    }
  }

  const getMenuItems = computed((): MenuItem[] => {
    return dataList.value.map(category => mapCategoryToMenu(category))
  })

  const getMenuMain = computed<MenuItem>(() => {
    if (!dataList.value.length) {
      return {} as MenuItem
    }

    return {
      label: 'Sản phẩm',
      path: '',
      icon: dataList.value[0].image,
      children: dataList.value.map(category =>
        mapCategoryToMenu(category)
      ),
    } as unknown as MenuItem
  })


  return {
    dataList,
    fetchCategoryStore,
    getListData,
    getFlatCategoryList,
    getMenuItems,
    loading,
    getMenuMain,
  };
})
