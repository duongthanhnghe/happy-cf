import { ref, computed } from "vue";
import { addressesAPI } from "@/services/addresses.service";
import type { AddressDTO } from '@/server/types/dto/address.dto';

export const useAddressAll = () => {
  const listData = ref<AddressDTO[]|null>(null);

  const fetchAddressAll = async (userId: string) => {
    try {
      const data = await addressesAPI.getAll(userId)
      if(data.code === 0) listData.value = data.data
    } catch (err) {
      console.error('Error product all', err)
    }
  }

  const getListAddressAllApi = computed(() => listData.value);

  return {
    fetchAddressAll,
    getListAddressAllApi
  }
}