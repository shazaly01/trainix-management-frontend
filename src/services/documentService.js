//src\services\documentService.js
import apiClient from './apiClient'

const resource = '/documents'

export default {
  // ✅ التعديل هنا: جعلها تستقبل (params) كـ Object لتقبل أي فلاتر
  get(params = {}) {
    return apiClient.get(resource, {
      params: params,
    })
  },

  find(id) {
    return apiClient.get(`${resource}/${id}`)
  },

  // دالة الرفع تقبل formData من المكون (Component)
  create(formData) {
    return apiClient.post(resource, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  delete(id) {
    return apiClient.delete(`${resource}/${id}`)
  },
}
