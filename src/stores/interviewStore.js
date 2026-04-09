import { defineStore } from 'pinia'
import { ref } from 'vue'
import interviewService from '@/services/InterviewService'

export const useInterviewStore = defineStore('interview', () => {
  // --- State ---
  const interviews = ref([]) // قائمة جلسات المقابلات (الرأس/Master)
  const interviewerAgenda = ref([]) // مخصص لجدول مقابلات موظف معين
  const applicantInterviews = ref([]) // ✅ مخصص لتاريخ مقابلات طلب توظيف محدد
  const pagination = ref({})
  const currentInterview = ref(null) // الجلسة الحالية وبداخلها تفاصيل المرشحين (Details)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchInterviews(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await interviewService.get(page, search)
      interviews.value = response.data.data
      pagination.value = response.data.meta || {}
    } catch (err) {
      error.value = 'فشل في جلب جلسات المقابلات.'
      console.error(err)
      interviews.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchInterviewsByInterviewer(empCode) {
    loading.value = true
    error.value = null
    try {
      const response = await interviewService.getByInterviewer(empCode)
      interviewerAgenda.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب جدول المقابلات للموظف.'
      console.error(err)
      interviewerAgenda.value = []
    } finally {
      loading.value = false
    }
  }

  // ✅ دالة جديدة: جلب سجل المقابلات لطلب توظيف (مفيد في صفحة تفاصيل المتقدم)
  async function fetchInterviewsByApplication(applicationId) {
    loading.value = true
    error.value = null
    try {
      const response = await interviewService.getByApplication(applicationId)
      applicantInterviews.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب سجل المقابلات لهذا الطلب.'
      console.error(err)
      applicantInterviews.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchInterview(id) {
    loading.value = true
    error.value = null
    currentInterview.value = null
    try {
      const response = await interviewService.find(id)
      // currentInterview.value ستحتوي الآن على (الرأس) ومصفوفة (Details) فيها المرشحين
      currentInterview.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب تفاصيل جلسة المقابلة.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  /**
   * ✅ ملاحظة هامة جداً للمطور: الـ Payload الآن يجب أن يكون Master-Detail
   * payload = {
   * job_request_id: 1, EmpCode: 1002, InterviewDate: '2026-04-10',
   * candidates: [ { application_id: 10, InterviewTime: '09:00' }, ... ]
   * }
   */
  async function createInterview(payload) {
    loading.value = true
    error.value = null
    try {
      await interviewService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في إنشاء جلسة المقابلة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * ✅ تحديث المقابلة (إدخال الدرجات أو تعديل الأوقات)
   * payload = {
   * candidates: [ { application_id: 10, EvaluationScore: 85, Result: 'Passed' }, ... ]
   * }
   */
  async function updateInterview(id, payload) {
    loading.value = true
    error.value = null
    try {
      await interviewService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في تحديث نتائج المقابلة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteInterview(id) {
    loading.value = true
    error.value = null
    try {
      await interviewService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في إلغاء الجلسة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    interviews,
    interviewerAgenda,
    applicantInterviews, // المتغير الجديد
    pagination,
    currentInterview,
    loading,
    error,

    // Actions
    fetchInterviews,
    fetchInterviewsByInterviewer,
    fetchInterviewsByApplication, // الدالة الجديدة
    fetchInterview,
    createInterview,
    updateInterview,
    deleteInterview,
  }
})
