import apiClient from './apiClient'

const resource = '/qualifications'

export default {
  get(page = 1, search = '') {
    return apiClient.get(resource, {
      params: { page, search },
    })
  },

  // جلب مؤهلات متقدم معين (لعرضها في صفحة الملف الشخصي للمتقدم)
  getByApplicant(applicantId) {
    return apiClient.get(`/applicants/${applicantId}/qualifications`)
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
