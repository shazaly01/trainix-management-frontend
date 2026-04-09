import { defineStore } from 'pinia'
import { ref } from 'vue'
import applicantQualificationService from '@/services/ApplicantQualificationService'

export const useApplicantQualificationStore = defineStore('applicantQualification', () => {
  // --- State ---
  const qualifications = ref([])
  const applicantQualifications = ref([]) // مخصص لمؤهلات متقدم معين
  const pagination = ref({})
  const currentQualification = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchQualifications(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await applicantQualificationService.get(page, search)
      qualifications.value = response.data.data
      pagination.value = response.data.meta || {}
    } catch (err) {
      error.value = 'فشل في جلب المؤهلات.'
      console.error(err)
      qualifications.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchQualificationsByApplicant(applicantId) {
    loading.value = true
    error.value = null
    try {
      const response = await applicantQualificationService.getByApplicant(applicantId)
      applicantQualifications.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب مؤهلات المتقدم.'
      console.error(err)
      applicantQualifications.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchQualification(id) {
    loading.value = true
    error.value = null
    currentQualification.value = null
    try {
      const response = await applicantQualificationService.find(id)
      currentQualification.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب تفاصيل المؤهل.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createQualification(payload) {
    loading.value = true
    error.value = null
    try {
      await applicantQualificationService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في إضافة المؤهل.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateQualification(id, payload) {
    loading.value = true
    error.value = null
    try {
      await applicantQualificationService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في تحديث المؤهل.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteQualification(id) {
    loading.value = true
    error.value = null
    try {
      await applicantQualificationService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في حذف المؤهل.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    qualifications,
    applicantQualifications,
    pagination,
    currentQualification,
    loading,
    error,
    fetchQualifications,
    fetchQualificationsByApplicant,
    fetchQualification,
    createQualification,
    updateQualification,
    deleteQualification,
  }
})
