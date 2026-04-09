//src\stores\jobRequestStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import jobRequestService from '@/services/JobRequestService'

export const useJobRequestStore = defineStore('jobRequest', () => {
  // --- State ---
  const jobRequests = ref([])
  const openJobRequests = ref([]) // مخصص للطلبات المفتوحة
  const pagination = ref({})
  const currentJobRequest = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---

  // جلب كافة الطلبات (للمدراء)
  async function fetchJobRequests(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await jobRequestService.get(page, search)
      jobRequests.value = response.data.data
      pagination.value = response.data.meta || {}
    } catch (err) {
      error.value = 'فشل في جلب طلبات التوظيف.'
      console.error(err)
      jobRequests.value = []
    } finally {
      loading.value = false
    }
  }

  // جلب الطلبات المفتوحة (للقوائم المنسدلة وبوابة التوظيف العامة)
  async function fetchOpenJobRequests() {
    loading.value = true
    error.value = null
    try {
      const response = await jobRequestService.getOpen()
      openJobRequests.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب الطلبات المفتوحة.'
      console.error(err)
      openJobRequests.value = []
    } finally {
      loading.value = false
    }
  }

  // جلب تفاصيل طلب توظيف عبر الـ ID (للمدراء)
  async function fetchJobRequest(id) {
    loading.value = true
    error.value = null
    currentJobRequest.value = null
    try {
      const response = await jobRequestService.find(id)
      currentJobRequest.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب تفاصيل طلب التوظيف.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  /**
   * ✅ الأكشن الجديد: جلب طلب التوظيف عبر الرابط (Slug)
   * يُستخدم في بوابة التوظيف العامة للمتقدمين
   */
  async function fetchJobRequestBySlug(slug) {
    loading.value = true
    error.value = null
    currentJobRequest.value = null
    try {
      const response = await jobRequestService.getBySlug(slug)
      currentJobRequest.value = response.data.data
    } catch (err) {
      error.value = 'عذراً، هذا الرابط غير صالح أو انتهت فترة التقديم على هذه الوظيفة.'
      console.error('Fetch by slug error:', err)
    } finally {
      loading.value = false
    }
  }

  async function createJobRequest(payload) {
    loading.value = true
    error.value = null
    try {
      await jobRequestService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في إنشاء طلب التوظيف.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateJobRequest(id, payload) {
    loading.value = true
    error.value = null
    try {
      await jobRequestService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في تحديث طلب التوظيف.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteJobRequest(id) {
    loading.value = true
    error.value = null
    try {
      await jobRequestService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في حذف طلب التوظيف.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    jobRequests,
    openJobRequests,
    pagination,
    currentJobRequest,
    loading,
    error,
    fetchJobRequests,
    fetchOpenJobRequests,
    fetchJobRequest,
    fetchJobRequestBySlug, // ✅ تم إضافة الدالة الجديدة هنا
    createJobRequest,
    updateJobRequest,
    deleteJobRequest,
  }
})
