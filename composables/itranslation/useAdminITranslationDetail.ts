import { computed } from "vue";
import { useState } from "nuxt/app";
import type { TranslationDTO } from "@/server/types/dto/v1/itranslation.dto";
import { iTranslationAPI } from "@/services/v1/admin/itranslation.service";

export const useAdminITranslationDetail = () => {
  
  const detailData = useState<TranslationDTO | null>('itranslation-detail', () => null)
  
  const fetchITranslationDetail = async (id: string) => {
    try {
      const data = await iTranslationAPI.getTranslationDetail(id)
      if(data.code === 0){
        detailData.value = data.data
        return data
      } 
    } catch (error) {
      console.error("Error fetching detail:", error)
    }
  }

  const getITranslationDetail = computed(() => detailData.value )

  return {
   fetchITranslationDetail,
   getITranslationDetail
  }
}