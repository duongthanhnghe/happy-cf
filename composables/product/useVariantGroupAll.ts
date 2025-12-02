import { ref, computed } from "vue";
import { variantGroupAPI } from "@/services/v1/variant-group.service"; 
import type { VariantGroupDTO } from '@/server/types/dto/v1/product.dto';

export const useVariantGroupAll = () => {
  
  const listVariantGroup = ref<VariantGroupDTO[]>([]);
  const loading = ref(false)

  const fetchListVariantGroup = async () => {
    loading.value = true;
    try {
      const data = await variantGroupAPI.getAll()
      if(data.code === 0) listVariantGroup.value = data.data
    } catch (err) {
      console.error('Error variant all', err)
    } finally {
      loading.value = false;
    }
  }

  const getListVariantGroup = computed(() => listVariantGroup.value);

  return {
    loading,
    listVariantGroup,
    fetchListVariantGroup,
    getListVariantGroup
  }
}