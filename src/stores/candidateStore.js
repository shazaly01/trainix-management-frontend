import { defineStore } from 'pinia'
import { ref } from 'vue'
import candidateService from '@/services/CandidateService'

export const useCandidateStore = defineStore('candidate', () => {
  // --- State (الحالة الأساسية) ---
  const candidates = ref([])
  const pagination = ref({})

  const currentCandidate = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 🌟 --- State (الخاصة بالطلبات المعلقة القادمة من الخارج) ---
  const pendingCandidates = ref([])
  const pendingPagination = ref({})

  // --- Actions ---

  /**
   * جلب كافة المترشحين (النهائيين المعتمدين فقط)
   * @param {number} page - رقم الصفحة
   * @param {string} search - نص البحث (الاسم، الرقم الوطني، إلخ)
   * @param {object} filters - الفلاتر الإضافية (مثل: { IsFit: 1, Size: 'XL' })
   */
  async function fetchCandidates(page = 1, search = '', filters = {}) {
    loading.value = true
    error.value = null
    try {
      // إرسال الصفحة، البحث، والفلاتر إلى الـ Service
      const response = await candidateService.get(page, search, filters)
      candidates.value = response.data.data
      pagination.value = response.data.meta || {}
    } catch (err) {
      error.value = 'فشل في جلب قائمة المترشحين.'
      console.error(err)
      candidates.value = []
    } finally {
      loading.value = false
    }
  }

  // جلب تفاصيل مترشح محدد عبر الـ ID (لغرض التعديل أو العرض)
  async function fetchCandidate(id) {
    loading.value = true
    error.value = null
    currentCandidate.value = null
    try {
      const response = await candidateService.find(id)
      currentCandidate.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب تفاصيل المترشح.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // إضافة مترشح جديد (الـ payload قد يحتوي على FormData لوجود صورة)
  async function createCandidate(payload) {
    loading.value = true
    error.value = null
    try {
      await candidateService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في إضافة المترشح.'
      console.error(err)
      throw err // رمي الخطأ لكي تتعامل معه الواجهة (مثل إظهار رسالة أو أخطاء الحقول)
    } finally {
      loading.value = false
    }
  }

  // تحديث بيانات المترشح (الـ payload قد يحتوي على FormData)
  async function updateCandidate(id, payload) {
    loading.value = true
    error.value = null
    try {
      await candidateService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في تحديث بيانات المترشح.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // حذف (أرشفة) مترشح
  async function deleteCandidate(id) {
    loading.value = true
    error.value = null
    try {
      await candidateService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في حذف المترشح.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // جلب كافة البيانات لغرض طباعة التقرير
  async function fetchAllForReport(search = '', filters = {}) {
    loading.value = true
    try {
      // نرسل per_page: -1 لكي ينفذ الباك إند كود الـ get() بدلاً من paginate()
      const response = await candidateService.get(1, search, { ...filters, per_page: -1 })
      return response.data.data // نعيد البيانات مباشرة لاستخدامها في مكون التقرير
    } catch (err) {
      error.value = 'حدث خطأ أثناء تجهيز بيانات التقرير'
      console.error(err)
      return []
    } finally {
      loading.value = false
    }
  }

  // 🌟 جلب قائمة الطلبات المعلقة (التي تحتاج مراجعة واعتماد)
  async function fetchPendingCandidates(page = 1, search = '', filters = {}) {
    // 👈 أضفنا filters هنا
    loading.value = true
    error.value = null
    try {
      // 👈 تمرير الفلاتر للـ Service
      const response = await candidateService.getPendingList(page, search, filters)
      pendingCandidates.value = response.data.data
      pendingPagination.value = response.data.meta || {}
    } catch (err) {
      error.value = err.response?.data?.message || 'حدث خطأ في جلب الطلبات المعلقة'
      console.error(err)
      pendingCandidates.value = []
    } finally {
      loading.value = false
    }
  }

  // 🌟 اعتماد مترشح ونقله للقائمة النهائية
  async function approveCandidate(id) {
    loading.value = true
    error.value = null
    try {
      await candidateService.approveCandidate(id)
      // إزالة المترشح من قائمة المراجعة محلياً فور اعتماده لتحديث الشاشة فوراً
      pendingCandidates.value = pendingCandidates.value.filter((c) => c.id !== id)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل اعتماد المترشح'
      console.error(err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    // State الأساسية
    candidates,
    pagination,
    currentCandidate,
    loading,
    error,

    // State الطلبات المعلقة
    pendingCandidates,
    pendingPagination,

    // Actions الأساسية
    fetchCandidates,
    fetchCandidate,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    fetchAllForReport,

    // Actions الطلبات المعلقة
    fetchPendingCandidates,
    approveCandidate,
  }
})
