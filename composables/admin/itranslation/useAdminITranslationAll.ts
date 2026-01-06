import { ref, computed } from "vue";
import { iTranslationAPI } from "@/services/v1/admin/itranslation.service";
import type { TranslationPaginationDTO } from "@/server/types/dto/v1/itranslation.dto";

export const useAdminITranslationAll = () => {
  
  const listITranslation = ref<TranslationPaginationDTO>();

  const fetchListITranslationAll = async (page: number, limit: number, search: string) => {
    try {
      const data = await iTranslationAPI.getTranslations(page, limit, search)
      if(data.code === 0) listITranslation.value = data
    } catch (err) {
      console.error('Error product all', err)
    }
  }

  const getListITranslation = computed(() => listITranslation.value);

  return {
    listITranslation,
    fetchListITranslationAll,
    getListITranslation
  }
}