import apiClient from './apiClient'

const resource = '/applications'

export default {
  get(filters = {}) {
    return apiClient.get('/applications', { params: filters })
  },

  // مسار مخصص: جلب جميع التقديمات الخاصة بمتقدم معين (تُعرض في ملفه الشخصي)
  getByApplicant(applicantId) {
    return apiClient.get(`${resource}/by-applicant/${applicantId}`)
  },

  // مسار مخصص: جلب جميع المتقدمين لطلب توظيف معين (شاغر محدد)
  getByJobRequest(requestId) {
    return apiClient.get(`${resource}/by-request/${requestId}`)
  },

  find(id) {
    // رقم الحركة TransactionNo الطويل سيمر هنا كنص (String) عبر الرابط بدون أي مشاكل
    return apiClient.get(`${resource}/${id}`)
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
