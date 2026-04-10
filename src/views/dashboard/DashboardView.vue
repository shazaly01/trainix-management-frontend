<template>
  <div class="space-y-8 min-h-screen bg-surface-ground text-white p-4">
    <div class="flex justify-between items-center mb-6">
      <h1
        class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-md"
      >
        لوحة تحكم الدورات التدريبية
      </h1>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <svg
        class="animate-spin h-12 w-12 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>

    <div v-else class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          class="bg-gray-900/80 p-6 rounded-2xl border border-blue-500/30 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.7)] transition-all duration-300 flex flex-col justify-center items-center backdrop-blur-md"
        >
          <span class="text-blue-200 text-sm font-semibold mb-2 tracking-wider"
            >إجمالي المتدربين</span
          >
          <span
            class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200"
            >{{ stats.total_candidates || 0 }}</span
          >
        </div>

        <div
          class="bg-gray-900/80 p-6 rounded-2xl border border-purple-500/30 shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.7)] transition-all duration-300 flex flex-col justify-center items-center backdrop-blur-md"
        >
          <span class="text-purple-200 text-sm font-semibold mb-2 tracking-wider"
            >الدورات التدريبية</span
          >
          <span
            class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-200"
            >{{ stats.total_job_requests || 0 }}</span
          >
        </div>

        <div
          class="bg-gray-900/80 p-6 rounded-2xl border border-emerald-500/30 shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.7)] transition-all duration-300 flex flex-col justify-center items-center backdrop-blur-md"
        >
          <span class="text-emerald-200 text-sm font-semibold mb-2 tracking-wider"
            >اللائقين طبياً</span
          >
          <span
            class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200"
            >{{ stats.fit_candidates || 0 }}</span
          >
        </div>

        <div
          class="bg-gray-900/80 p-6 rounded-2xl border border-rose-500/30 shadow-[0_0_20px_-5px_rgba(244,63,94,0.5)] hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.7)] transition-all duration-300 flex flex-col justify-center items-center backdrop-blur-md"
        >
          <span class="text-rose-200 text-sm font-semibold mb-2 tracking-wider">غير اللائقين</span>
          <span
            class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-200"
            >{{ stats.unfit_candidates || 0 }}</span
          >
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          class="bg-gray-900/60 p-6 rounded-2xl border border-gray-700 shadow-lg backdrop-blur-md"
        >
          <h2 class="text-lg font-bold text-cyan-300 mb-4 border-b border-gray-700 pb-2">
            توزيع مقاسات الزي
          </h2>
          <div class="space-y-3">
            <div
              v-for="(count, size) in charts.sizes"
              :key="size"
              class="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition"
            >
              <span class="font-medium text-gray-300">مقاس {{ size }}</span>
              <span
                class="bg-cyan-500/20 text-cyan-300 py-1 px-3 rounded-full font-bold shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                >{{ count }}</span
              >
            </div>
            <div
              v-if="!charts.sizes || Object.keys(charts.sizes).length === 0"
              class="text-gray-500 text-center py-4"
            >
              لا توجد بيانات للمقاسات
            </div>
          </div>
        </div>

        <div
          class="bg-gray-900/60 p-6 rounded-2xl border border-gray-700 shadow-lg backdrop-blur-md"
        >
          <h2 class="text-lg font-bold text-purple-300 mb-4 border-b border-gray-700 pb-2">
            توزيع أنواع التدريب
          </h2>
          <div class="space-y-3">
            <div
              v-for="(count, type) in charts.training_types"
              :key="type"
              class="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition"
            >
              <span class="font-medium text-gray-300">{{ type }}</span>
              <span
                class="bg-purple-500/20 text-purple-300 py-1 px-3 rounded-full font-bold shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                >{{ count }}</span
              >
            </div>
            <div
              v-if="!charts.training_types || Object.keys(charts.training_types).length === 0"
              class="text-gray-500 text-center py-4"
            >
              لا توجد بيانات لأنواع التدريب
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-gray-900/60 rounded-2xl border border-gray-700 shadow-xl backdrop-blur-md overflow-hidden"
      >
        <div class="px-6 py-5 border-b border-gray-700 bg-gray-800/40">
          <h2
            class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400"
          >
            أحدث المتدربين المسجلين
          </h2>
        </div>
        <div class="p-4">
          <AppTable :headers="candidateHeaders" :items="recentCandidates" :rowClickable="false">
            <template #cell-IsFit="{ item }">
              <span
                v-if="item.IsFit"
                class="text-xs font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_5px_rgba(16,185,129,0.3)]"
                >لائق</span
              >
              <span
                v-else
                class="text-xs font-bold px-2 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_5px_rgba(244,63,94,0.3)]"
                >غير لائق</span
              >
            </template>
          </AppTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dashboardService from '@/services/DashboardService'
import AppTable from '@/components/ui/AppTable.vue'

// 1. إدارة الحالة محلياً (Local State)
const loading = ref(true)
const stats = ref({})
const charts = ref({
  sizes: {},
  training_types: {},
})
const recentCandidates = ref([])

// 2. إعداد أعمدة جدول أحدث المتدربين
const candidateHeaders = ref([
  { key: 'SequenceNo', label: 'رقم التسلسل' },
  { key: 'Name', label: 'اسم المتدرب' },
  { key: 'CourseName', label: 'الدورة التدريبية' },
  { key: 'TrainingType', label: 'نوع التدريب' },
  { key: 'IsFit', label: 'حالة اللياقة' },
  { key: 'RegisteredAt', label: 'تاريخ التسجيل' },
])

// 3. جلب البيانات من الـ API
const fetchDashboardData = async () => {
  loading.value = true
  try {
    const response = await dashboardService.getTrainingStats()
    if (response.data && response.data.success) {
      const payload = response.data.data
      stats.value = payload.stats || {}
      charts.value = payload.charts || { sizes: {}, training_types: {} }
      recentCandidates.value = payload.recent_candidates || []
    }
  } catch (error) {
    console.error('خطأ في جلب بيانات لوحة التحكم:', error)
  } finally {
    loading.value = false
  }
}

// 4. تنفيذ الجلب عند تحميل المكون
onMounted(() => {
  fetchDashboardData()
})
</script>
