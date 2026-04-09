import apiClient from './apiClient'

const resource = '/interviews'

export default {
  // جلب كل جلسات المقابلات (مع دعم البحث والصفحات)
  get(page = 1, search = '') {
    return apiClient.get(resource, { params: { page, search } })
  },

  // جلب أجندة المقابلات لموظف/مُقيّم معين
  getByInterviewer(empCode) {
    return apiClient.get(`${resource}/by-interviewer/${empCode}`)
  },

  // جلب سجل المقابلات لطلب توظيف محدد (مرشح)
  getByApplication(applicationId) {
    return apiClient.get(`${resource}/by-application/${applicationId}`)
  },

  // جلب تفاصيل جلسة معينة (الرأس + التفاصيل)
  find(id) {
    return apiClient.get(`${resource}/${id}`)
  },

  // إنشاء جلسة جديدة (Master-Detail)
  create(payload) {
    return apiClient.post(resource, payload)
  },

  // تحديث الجلسة أو إدخال درجات المرشحين
  update(id, payload) {
    return apiClient.put(`${resource}/${id}`, payload)
  },

  // إلغاء/حذف جلسة المقابلة
  delete(id) {
    return apiClient.delete(`${resource}/${id}`)
  },
}
