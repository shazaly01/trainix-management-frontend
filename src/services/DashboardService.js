import apiClient from './apiClient'

export default {
  // الدالة القديمة (نحتفظ بها لعدم كسر أي نظام آخر)
  getStats() {
    return apiClient.get('/dashboard/stats')
  },

  // الدالة الجديدة الخاصة بلوحة تحكم الدورات التدريبية
  getTrainingStats() {
    return apiClient.get('/training-dashboard')
  },
}
