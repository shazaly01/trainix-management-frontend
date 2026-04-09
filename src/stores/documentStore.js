//src\stores\documentStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import documentService from '@/services/documentService'

export const useDocumentStore = defineStore('document', () => {
  // --- State ---
  const documents = ref([])
  const pagination = ref({})
  const currentDocument = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchDocuments(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await documentService.get({ page, search })
      documents.value = response.data.data
      pagination.value = response.data.meta || {}
    } catch (err) {
      error.value = 'فشل في جلب المستندات.'
      console.error(err)
      documents.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchDocument(id) {
    loading.value = true
    error.value = null
    currentDocument.value = null
    try {
      const response = await documentService.find(id)
      currentDocument.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب تفاصيل المستند.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // هنا نستقبل formData لأننا نرفع ملفات (File Upload)
  async function createDocument(formData) {
    loading.value = true
    error.value = null
    try {
      await documentService.create(formData)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في رفع المستند.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteDocument(id) {
    loading.value = true
    error.value = null
    try {
      await documentService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في حذف المستند.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // ✅ إضافة هذه الدالة لجلب مستندات متقدم محدد
  async function fetchDocumentsByApplicant(applicantId) {
    loading.value = true
    error.value = null
    try {
      // نرسل الـ id كفلتر للباك-أند (تأكد أن DocumentController يدعم الفلترة بهذا الشكل)
      const response = await documentService.get({
        documentable_id: applicantId,
        documentable_type: 'App\\Models\\Applicant',
      })
      documents.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب مستندات المتقدم.'
      console.error(err)
      documents.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    documents,
    pagination,
    currentDocument,
    loading,
    error,
    fetchDocuments,
    fetchDocument,
    createDocument,
    deleteDocument,
    fetchDocumentsByApplicant,
  }
})
