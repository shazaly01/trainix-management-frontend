//src\services\DepartmentService.js
import apiClient from './apiClient'

const resource = '/departments'

export default {
  get(page = 1, search = '') {
    return apiClient.get(resource, {
      params: {
        page: page,
        search: search,
      },
    })
  },

  // مسار مخصص لجلب الإدارات المفعلة فقط
  getActive() {
    return apiClient.get(`${resource}/active`)
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
}
