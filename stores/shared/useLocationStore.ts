import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useLocation } from "@/composables/product/useLocation";
import type { ProvinceDTO, DistrictDTO, WardDTO } from '@/server/types/dto/v1/location.dto'

const TTL_MS = 10 * 24 * 60 * 60 * 1000; // 10 ngày

export const useLocationStore = defineStore("LocationStore", () => {
  const {
    getProvinces,
    getDistricts,
    getWards,
    fetchProvinces,
    fetchDistrictsByProvince,
    fetchWardsByDistrict
  } = useLocation();

  const provinces = ref<ProvinceDTO[]>([])
  const districts = ref<DistrictDTO[]>([])
  const wards = ref<WardDTO[]>([])
  const lastFetched = ref<number | null>(null)
  const loading = ref(false)
  const selectedProvince = ref<number | null>(null)
  const selectedDistrict = ref<number | null>(null)
  const selectedWard = ref<number | null>(null)
  const isSetting = ref(false)

  const fetchProvincesStore = async () => {
    const now = Date.now()
    if (provinces.value.length > 0 && lastFetched.value && now - lastFetched.value < TTL_MS) return

    loading.value = true
    try {
      await fetchProvinces()
      provinces.value = getProvinces.value || []
      lastFetched.value = now
    } finally {
      loading.value = false
    }
  }

  const fetchDistrictsStore = async (provinceCode: number) => {
    loading.value = true
    try {
      await fetchDistrictsByProvince(provinceCode)
      districts.value = getDistricts.value || []
    } finally {
      loading.value = false
    }
  }

  const fetchWardsStore = async (districtCode: number) => {
    loading.value = true
    try {
      await fetchWardsByDistrict(districtCode)
      wards.value = getWards.value || []
    } finally {
      loading.value = false
    }
  }

  const setLocationProgrammatically = async (provinceCode: number,districtCode: number,wardCode: number) => {
    isSetting.value = true
    
    try {
      selectedProvince.value = provinceCode
      await fetchDistrictsStore(provinceCode)
      
      selectedDistrict.value = districtCode
      await fetchWardsStore(districtCode)
      
      selectedWard.value = wardCode
    } finally {
      isSetting.value = false
    }
  }

  const resetLocation = () => {
    selectedProvince.value = null
    selectedDistrict.value = null
    selectedWard.value = null
    districts.value = []
    wards.value = []
  }

  const getListProvinces = computed(() => provinces.value || [])
  const getListDistricts = computed(() => districts.value || [])
  const getListWards = computed(() => wards.value || [])

  return {
    provinces,
    districts,
    wards,
    lastFetched,
    loading,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    isSetting,
    fetchProvincesStore,
    fetchDistrictsStore,
    fetchWardsStore,
    setLocationProgrammatically,
    resetLocation,              
    getListProvinces,
    getListDistricts,
    getListWards,
  }
})