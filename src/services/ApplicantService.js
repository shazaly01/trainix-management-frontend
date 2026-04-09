import apiClient from './apiClient'

const resource = '/applicants'

export default {
  get(params = {}) {
    return apiClient.get(resource, {
      params: params, // سيرسل صفحة، بحث، مدينة، إلخ
    })
  },

  find(id) {
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

  // ✅ [الجديد]: دالة استكمال الطلب بواسطة الرقم الوطني والكود
  resume(payload) {
    return apiClient.post(`${resource}/resume`, payload)
  },
}
