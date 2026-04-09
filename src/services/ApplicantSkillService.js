import apiClient from './apiClient'

const resource = '/skills'

export default {
  get(page = 1, search = '') {
    return apiClient.get(resource, {
      params: { page, search },
    })
  },

  // جلب مهارات متقدم معين
  getByApplicant(applicantId) {
    return apiClient.get(`/applicants/${applicantId}/skills`)
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
