import { ref, computed } from "vue";
import { locationAPI } from "@/services/v1/location.service";
import type { ProvinceDTO, DistrictDTO, WardDTO } from '@/server/types/dto/v1/location.dto'

export const useLocation = () => {
  const provinces = ref<ProvinceDTO[]>([])
  const districts = ref<DistrictDTO[]>([])
  const wards = ref<WardDTO[]>([])
  const provinceDetail = ref<ProvinceDTO | null>(null)
  const districtDetail = ref<DistrictDTO | null>(null)
  const wardDetail = ref<WardDTO | null>(null)

  const fetchProvinces = async () => {
    try {
      const res = await locationAPI.getProvinces()
      if (res.code === 0) provinces.value = res.data
    } catch (error) {
      console.error("Error fetching provinces:", error)
    }
  }

  const fetchDistrictsByProvince = async (provinceCode: number) => {
    try {
      const res = await locationAPI.getDistrictsByProvince(provinceCode)
      if (res.code === 0) {
        districts.value = res.data ?? []
      }
    } catch (error) {
      console.error(`Error fetching districts for province ${provinceCode}:`, error)
    }
  }

  const fetchWardsByDistrict = async (districtCode: number) => {
    try {
      const res = await locationAPI.getWardsByDistrict(districtCode)
      if (res.code === 0) {
        wards.value = res.data ?? []
      }
    } catch (error) {
      console.error(`Error fetching wards for district ${districtCode}:`, error)
    }
  }

  const fetchProvinceDetail = async (code: number) => {
    try {
      const res = await locationAPI.getProvinceDetail(code)
      if (res.code === 0) provinceDetail.value = res.data ?? null
    } catch (error) {
      console.error(`Error fetching province detail ${code}:`, error)
    }
  }

  const fetchDistrictDetail = async (code: number) => {
    try {
      const res = await locationAPI.getDistrictDetail(code)
      if (res.code === 0) districtDetail.value = res.data ?? null
    } catch (error) {
      console.error(`Error fetching district detail ${code}:`, error)
    }
  }

  const fetchWardDetail = async (code: number, districtCode: number) => {
    try {
      const res = await locationAPI.getWardDetail(code, districtCode)
      if (res.code === 0) wardDetail.value = res.data ?? null
    } catch (error) {
      console.error(`Error fetching ward detail ${code}:`, error)
    }
  }

  const getProvinces = computed(() => provinces.value)
  const getDistricts = computed(() => districts.value)
  const getWards = computed(() => wards.value)
  const getProvinceDetail = computed(() => provinceDetail.value)
  const getDistrictDetail = computed(() => districtDetail.value)
  const getWardDetail = computed(() => wardDetail.value)

  return {
    getProvinces,
    getDistricts,
    getWards,
    fetchProvinces,
    fetchDistrictsByProvince,
    fetchWardsByDistrict,
    getProvinceDetail,
    getDistrictDetail,
    getWardDetail,
    fetchProvinceDetail,
    fetchDistrictDetail,
    fetchWardDetail
  }
}
