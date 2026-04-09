import { defineStore } from 'pinia'
import { ref } from 'vue'
import cityService from '@/services/CityService'

export const useCityStore = defineStore('city', () => {
  // --- State ---
  const cities = ref([])
  const activeCities = ref([]) // مخصص للقوائم المنسدلة
  const pagination = ref({})
  const currentCity = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchCities(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await cityService.get(page, search)
      cities.value = response.data.data
      pagination.value = response.data.meta || {}
    } catch (err) {
      error.value = 'فشل في جلب المدن.'
      console.error(err)
      cities.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchActiveCities() {
    loading.value = true
    error.value = null
    try {
      const response = await cityService.getActive()
      activeCities.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب المدن المفعلة.'
      console.error(err)
      activeCities.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchCity(id) {
    loading.value = true
    error.value = null
    currentCity.value = null
    try {
      const response = await cityService.find(id)
      currentCity.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب تفاصيل المدينة.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createCity(payload) {
    loading.value = true
    error.value = null
    try {
      await cityService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في إضافة المدينة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCity(id, payload) {
    loading.value = true
    error.value = null
    try {
      await cityService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في تحديث بيانات المدينة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCity(id) {
    loading.value = true
    error.value = null
    try {
      await cityService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في حذف المدينة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    cities,
    activeCities,
    pagination,
    currentCity,
    loading,
    error,
    fetchCities,
    fetchActiveCities,
    fetchCity,
    createCity,
    updateCity,
    deleteCity,
  }
})
