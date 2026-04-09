import { defineStore } from 'pinia'
import { ref } from 'vue'
import applicantExperienceService from '@/services/ApplicantExperienceService'

export const useApplicantExperienceStore = defineStore('applicantExperience', () => {
  // --- State ---
  const experiences = ref([])
  const applicantExperiences = ref([])
  const pagination = ref({})
  const currentExperience = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchExperiences(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await applicantExperienceService.get(page, search)
      experiences.value = response.data.data
      pagination.value = response.data.meta || {}
    } catch (err) {
      error.value = 'فشل في جلب الخبرات.'
      console.error(err)
      experiences.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchExperiencesByApplicant(applicantId) {
    loading.value = true
    error.value = null
    try {
      const response = await applicantExperienceService.getByApplicant(applicantId)
      applicantExperiences.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب خبرات المتقدم.'
      console.error(err)
      applicantExperiences.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchExperience(id) {
    loading.value = true
    error.value = null
    currentExperience.value = null
    try {
      const response = await applicantExperienceService.find(id)
      currentExperience.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب تفاصيل الخبرة.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createExperience(payload) {
    loading.value = true
    error.value = null
    try {
      await applicantExperienceService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في إضافة الخبرة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateExperience(id, payload) {
    loading.value = true
    error.value = null
    try {
      await applicantExperienceService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في تحديث الخبرة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteExperience(id) {
    loading.value = true
    error.value = null
    try {
      await applicantExperienceService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في حذف الخبرة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    experiences,
    applicantExperiences,
    pagination,
    currentExperience,
    loading,
    error,
    fetchExperiences,
    fetchExperiencesByApplicant,
    fetchExperience,
    createExperience,
    updateExperience,
    deleteExperience,
  }
})
