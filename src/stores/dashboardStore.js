import { defineStore } from 'pinia'
import { ref } from 'vue'
import dashboardService from '@/services/DashboardService'

export const useDashboardStore = defineStore('dashboard', () => {
  // --- State ---
  const stats = ref({})
  const applicationsChart = ref({})
  const upcomingInterviews = ref([])
  const recentApplications = ref([])
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchDashboardData() {
    loading.value = true
    error.value = null
    try {
      const response = await dashboardService.getStats()
      const data = response.data.data

      // توزيع البيانات القادمة من الواجهة الخلفية على المتغيرات
      stats.value = data.stats || {}
      applicationsChart.value = data.applications_chart || {}
      upcomingInterviews.value = data.upcoming_interviews || []
      recentApplications.value = data.recent_applications || []
    } catch (err) {
      error.value = 'فشل في جلب بيانات لوحة التحكم.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    stats,
    applicationsChart,
    upcomingInterviews,
    recentApplications,
    loading,
    error,
    fetchDashboardData,
  }
})
