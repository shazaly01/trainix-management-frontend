import { defineStore } from 'pinia'
import { ref } from 'vue'
import applicantService from '@/services/ApplicantService'

export const useApplicantStore = defineStore('applicant', () => {
  // --- State ---
  const applicants = ref([])
  const pagination = ref({})
  const currentApplicant = ref(null)

  // ✅ [الجديد]: متغير لحفظ كود التتبع وعرضه للمستخدم
  const trackingCode = ref(null)

  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchApplicants(filters = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await applicantService.get(filters)
      applicants.value = response.data.data
      pagination.value = response.data.meta || {}
    } catch (err) {
      error.value = 'فشل في جلب بيانات المتقدمين.'
      console.error(err)
      applicants.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchApplicant(id) {
    loading.value = true
    error.value = null
    currentApplicant.value = null
    try {
      const response = await applicantService.find(id)
      currentApplicant.value = response.data.data

      return response.data.data // ✅ أضف هذا السطر لكي يستلم الأب البيانات
    } catch (err) {
      error.value = 'فشل في جلب بيانات المتقدم.'
      console.error(err)
      throw err // نمرر الخطأ ليراه المكون
    } finally {
      loading.value = false
    }
  }

  async function createApplicant(payload) {
    loading.value = true
    error.value = null
    try {
      const response = await applicantService.create(payload)

      // ✅ [الجديد]: التقاط كود التتبع من الباك-أند وحفظه في الستور
      trackingCode.value = response.data.tracking_code

      // إرجاع البيانات (data) كما كانت
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في حفظ البيانات.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateApplicant(id, payload) {
    loading.value = true
    error.value = null
    try {
      await applicantService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في تحديث بيانات المتقدم.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteApplicant(id) {
    loading.value = true
    error.value = null
    try {
      await applicantService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في حذف المتقدم.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // ✅ [الجديد]: دالة استكمال الطلب من واجهة الدخول
  async function resumeApplication(payload) {
    loading.value = true
    error.value = null
    try {
      const response = await applicantService.resume(payload)
      // حفظ بيانات المتقدم لاستخدامها في الخطوات
      currentApplicant.value = response.data.data
      // تحديث كود التتبع
      trackingCode.value = payload.tracking_code

      return response.data.data
    } catch (err) {
      // إرجاع رسالة الخطأ لتظهر في الشاشة (مثل: الكود غير صحيح)
      error.value = err.response?.data?.message || 'بيانات الدخول غير صحيحة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    applicants,
    pagination,
    currentApplicant,
    trackingCode, // ✅ تصدير المتغير
    loading,
    error,
    fetchApplicants,
    fetchApplicant,
    createApplicant,
    updateApplicant,
    deleteApplicant,
    resumeApplication, // ✅ تصدير الدالة الجديدة
  }
})
