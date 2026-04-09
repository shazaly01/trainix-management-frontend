<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-text-primary">لوحة التحكم</h1>
    </div>

    <div v-if="dashboardStore.loading" class="flex justify-center py-10">
      <svg
        class="animate-spin h-8 w-8 text-primary"
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

    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          class="bg-surface-section p-6 rounded-xl shadow-sm border border-surface-border flex flex-col justify-center items-center"
        >
          <span class="text-text-secondary text-sm font-medium mb-2">إجمالي المتقدمين</span>
          <span class="text-3xl font-bold text-primary">{{
            dashboardStore.stats.total_applicants || 0
          }}</span>
        </div>

        <div
          class="bg-surface-section p-6 rounded-xl shadow-sm border border-surface-border flex flex-col justify-center items-center"
        >
          <span class="text-text-secondary text-sm font-medium mb-2">إجمالي التقديمات</span>
          <span class="text-3xl font-bold text-blue-500">{{
            dashboardStore.stats.total_applications || 0
          }}</span>
        </div>

        <div
          class="bg-surface-section p-6 rounded-xl shadow-sm border border-surface-border flex flex-col justify-center items-center"
        >
          <span class="text-text-secondary text-sm font-medium mb-2">الشواغر المفتوحة</span>
          <span class="text-3xl font-bold text-green-500">{{
            dashboardStore.stats.open_job_requests || 0
          }}</span>
        </div>

        <div
          class="bg-surface-section p-6 rounded-xl shadow-sm border border-surface-border flex flex-col justify-center items-center"
        >
          <span class="text-text-secondary text-sm font-medium mb-2">الإدارات النشطة</span>
          <span class="text-3xl font-bold text-purple-500">{{
            dashboardStore.stats.total_departments || 0
          }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          class="bg-surface-section rounded-xl shadow-sm border border-surface-border overflow-hidden"
        >
          <div class="px-6 py-4 border-b border-surface-border bg-surface-ground">
            <h2 class="text-lg font-semibold text-text-primary">المقابلات القادمة</h2>
          </div>
          <div class="p-4">
            <AppTable
              :headers="interviewHeaders"
              :items="dashboardStore.upcomingInterviews"
              :rowClickable="false"
            />
          </div>
        </div>

        <div
          class="bg-surface-section rounded-xl shadow-sm border border-surface-border overflow-hidden"
        >
          <div class="px-6 py-4 border-b border-surface-border bg-surface-ground">
            <h2 class="text-lg font-semibold text-text-primary">أحدث التقديمات</h2>
          </div>
          <div class="p-4">
            <AppTable
              :headers="applicationHeaders"
              :items="dashboardStore.recentApplications"
              :rowClickable="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import AppTable from '@/components/ui/AppTable.vue'

const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.fetchDashboardData()
})

// إعداد أعمدة جدول المقابلات القادمة
const interviewHeaders = ref([
  { key: 'InterviewDate', label: 'الموعد' },
  { key: 'ApplicantName', label: 'المتقدم' },
  { key: 'JobTitle', label: 'الوظيفة' },
])

// إعداد أعمدة جدول أحدث التقديمات
const applicationHeaders = ref([
  { key: 'ApplicantName', label: 'المتقدم' },
  { key: 'DepartmentName', label: 'الإدارة' },
  { key: 'Status', label: 'الحالة' },
  { key: 'SubmittedAt', label: 'التاريخ' },
])
</script>
