//src\services\JobRequestService.js
import apiClient from './apiClient'

const resource = '/job-requests'

export default {
  get(page = 1, search = '') {
    return apiClient.get(resource, {
      params: {
        page: page,
        search: search,
      },
    })
  },

  // مسار مخصص لجلب الطلبات المفتوحة فقط (للربط مع المتقدمين)
  getOpen() {
    return apiClient.get(`${resource}/open`)
  },

  find(id) {
    return apiClient.get(`${resource}/${id}`) // يدعم الأرقام الطويلة RequestNo تلقائياً
  },

  /**
   * ✅ الدالة المضافة لحل المشكلة: جلب بيانات الوظيفة باستخدام الرابط (Slug)
   * هذا المسار يطابق المسار العام المعرف في ملف routes/api.php
   */
  getBySlug(slug) {
    return apiClient.get(`${resource}/detail/${slug}`)
  },

  create(payload) {
    return apiClient.post(resource, payload)
  },

  update(id, payload) {
    return apiClient.put(`${resource}/${id}`, payload)
  },

  delete(id) {
    return apiClient.delete(`${resource}/${id}`)
  },
}
