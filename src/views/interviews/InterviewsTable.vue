<template>
  <AppTable
    :headers="headers"
    :items="interviews"
    :is-loading="loading"
    :row-clickable="true"
    @row-click="(item) => $emit('edit', item)"
  >
    <template #cell-job_request="{ item }">
      <div v-if="item.JobRequest">
        <span class="font-bold text-text-primary group-hover:text-primary transition-colors">
          {{ item.JobRequest.RequiredMajor || 'وظيفة غير محددة' }}
        </span>
        <span class="block text-[10px] text-text-muted mt-0.5 font-mono">
          طلب رقم: #{{ item.JobRequest.RequestNo }}
        </span>
      </div>
      <span v-else class="text-text-muted italic text-xs">غير محدد</span>
    </template>

    <template #cell-candidates_count="{ item }">
      <span
        class="inline-flex items-center justify-center px-3 py-1 rounded-lg text-[11px] font-bold bg-primary/5 text-primary border border-primary/10"
      >
        {{ item.Details ? item.Details.length : 0 }} مرشحين
      </span>
    </template>

    <template #cell-EmpCode="{ item }">
      <span class="font-mono text-sm text-text-secondary font-medium">{{ item.EmpCode }}</span>
    </template>

    <template #cell-Status="{ item }">
      <span
        class="px-3 py-1 text-[11px] font-bold rounded-full border shadow-sm"
        :class="{
          'bg-warning/10 text-warning border-warning/20':
            item.Status === 'Scheduled' || item.Status === 'Pending',
          'bg-success/10 text-success border-success/20': item.Status === 'Completed',
          'bg-danger/10 text-danger border-danger/20': item.Status === 'Cancelled',
        }"
      >
        {{ getStatusLabel(item.Status) }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-end gap-2">
        <button
          @click.stop="goToEvaluation(item.id)"
          class="p-2 text-success/80 hover:text-success hover:bg-success/10 rounded-xl transition-all border border-transparent hover:border-success/20"
          title="بدء التقييم الفني للمرشحين"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </button>

        <button
          @click.stop="$emit('delete', item.id)"
          class="p-2 text-danger/70 hover:text-danger hover:bg-danger/10 rounded-xl transition-all border border-transparent hover:border-danger/20"
          title="إلغاء الجلسة"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppTable from '@/components/ui/AppTable.vue'

const props = defineProps({
  interviews: { type: Array, required: true },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['edit', 'delete'])
const router = useRouter()

// تعريف أعمدة الجدول
const headers = [
  {
    key: 'id',
    label: 'رقم',
    class: 'w-16 text-center',
    cellClass: 'text-center font-mono font-bold',
  },
  { key: 'job_request', label: 'الوظيفة المستهدفة' },
  { key: 'InterviewDate', label: 'تاريخ الجلسة', class: 'w-40' },
  { key: 'EmpCode', label: 'كود المُقيّم', class: 'w-32' },
  {
    key: 'candidates_count',
    label: 'المرشحين',
    class: 'w-28 text-center',
    cellClass: 'text-center',
  },
  { key: 'Status', label: 'الحالة', class: 'w-28 text-center', cellClass: 'text-center' },
  { key: 'actions', label: 'إجراءات التقييم', class: 'w-32 text-center' },
]

// دالة الانتقال لشاشة التقييم المنفصلة
const goToEvaluation = (id) => {
  router.push({
    name: 'InterviewEvaluation',
    params: { id: id },
  })
}

// تحويل الحالات إلى نصوص عربية
const getStatusLabel = (status) => {
  const statuses = {
    Scheduled: 'مجدولة',
    Pending: 'مجدولة',
    Completed: 'مكتملة التقييم',
    Cancelled: 'ملغاة',
  }
  return statuses[status] || status
}
</script>
