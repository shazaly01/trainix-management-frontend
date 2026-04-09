import apiClient from './apiClient'

const resource = '/experiences'

export default {
  get(page = 1, search = '') {
    return apiClient.get(resource, {
      params: { page, search },
    })
  },

  // جلب خبرات متقدم معين
  getByApplicant(applicantId) {
    return apiClient.get(`/applicants/${applicantId}/experiences`)
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
