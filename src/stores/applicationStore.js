import { defineStore } from 'pinia'
import { ref } from 'vue'
// افترضت وجود ملف الخدمة هذا بناءً على نمط مشروعك
import applicationService from '@/services/ApplicationService'

export const useApplicationStore = defineStore('application', () => {
  // --- State ---
  const applications = ref([])
  const pagination = ref({})
  const currentApplication = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  // نمرر الفلاتر ككائن واحد لتسهيل إضافة فلاتر لاحقاً (مثل حالة التقديم)
  async function fetchApplications(filters = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await applicationService.get(filters)
      applications.value = response.data.data
      pagination.value = response.data.meta || {}
    } catch (err) {
      error.value = 'فشل في جلب بيانات التقديمات.'
      console.error(err)
      applications.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchApplication(id) {
    loading.value = true
    error.value = null
    currentApplication.value = null
    try {
      const response = await applicationService.find(id)
      currentApplication.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب تفاصيل التقديم.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // غالباً في كيان الـ Applications لا نقوم بإنشاء تقديم جديد من لوحة الإدارة
  // (لأن المتقدم هو من ينشئه من الخارج)، بل نقوم بتحديث حالته.
  async function updateApplication(id, payload) {
    loading.value = true
    error.value = null
    try {
      await applicationService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في تحديث التقديم.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteApplication(id) {
    loading.value = true
    error.value = null
    try {
      await applicationService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في حذف التقديم.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // جلب تقديمات متقدم معين (مفيدة في شاشة ApplicantProfile)
  async function fetchApplicationsByApplicant(applicantId) {
    loading.value = true
    error.value = null
    try {
      const response = await applicationService.getByApplicant(applicantId)
      // قد ترغب في تخزينها في state منفصل إذا لم تكن تريد الكتابة فوق القائمة الرئيسية
      // لكن هنا سنكتبها في القائمة الرئيسية للتسهيل
      applications.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب تقديمات هذا المتقدم.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // جلب تقديمات شاغر معين (مفيدة في شاشة تفاصيل طلب التوظيف)
  async function fetchApplicationsByJobRequest(requestId) {
    loading.value = true
    error.value = null
    try {
      const response = await applicationService.getByJobRequest(requestId)
      applications.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب تقديمات هذا الشاغر.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    applications,
    pagination,
    currentApplication,
    loading,
    error,
    fetchApplications,
    fetchApplication,
    updateApplication,
    deleteApplication,
    fetchApplicationsByApplicant,
    fetchApplicationsByJobRequest,
  }
})
