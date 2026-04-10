<template>
  <div
    class="bg-[#0f172a] rounded-[1.5rem] shadow-2xl border border-slate-800/50 overflow-hidden font-sans"
  >
    <AppTable
      :headers="filteredHeaders"
      :items="items"
      :isLoading="isLoading"
      @row-click="$emit('row-click', $event)"
    >
      <template #cell-RequestNo="{ item }">
        <div class="flex items-center gap-2">
          <span
            class="font-mono text-sky-400 font-black bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20 text-xs"
          >
            {{ item.RequestNo }}
          </span>
        </div>
      </template>

      <template #cell-Department="{ item }">
        <span class="text-slate-200 font-bold text-sm">
          {{ item.Department?.Name || 'الإدارة العامة' }}
        </span>
      </template>

      <template #cell-RequiredMajor="{ item }">
        <span class="text-white font-black text-sm uppercase tracking-tight">
          {{ item.RequiredMajor }}
        </span>
      </template>

      <template #cell-ApplicationsCount="{ item }">
        <span
          class="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[11px] font-black"
        >
          {{ item.ApplicationsCount || 0 }} متدرب
        </span>
      </template>

      <template #cell-ApplyLink="{ item }">
        <button
          v-if="item.ApplyLink"
          @click.stop="copyToClipboard(item.ApplyLink)"
          class="flex items-center gap-2 text-[11px] font-black text-emerald-400 hover:text-white transition-all bg-emerald-500/10 hover:bg-emerald-500 px-3 py-1.5 rounded-lg border border-emerald-500/20"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              stroke-width="2.5"
            />
          </svg>
          نسخ الرابط
        </button>
        <span v-else class="text-slate-600 text-[10px] font-bold italic">رابط غير متوفر</span>
      </template>

      <template #cell-Status="{ item }">
        <span
          class="px-3 py-1 text-[10px] font-black rounded-full border uppercase"
          :class="getStatusClass(item.Status)"
        >
          {{ item.Status || 'مفتوح' }}
        </span>
      </template>

      <template #cell-actions="{ item }">
        <div class="flex items-center gap-2">
          <button
            v-if="auth.can('job_request.update')"
            @click.stop="$emit('edit', item)"
            class="w-8 h-8 bg-slate-800 text-sky-400 rounded-lg hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center border border-slate-700/50"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                stroke-width="2.5"
              />
            </svg>
          </button>

          <button
            v-if="auth.can('job_request.delete')"
            @click.stop="$emit('delete', item.id)"
            class="w-8 h-8 bg-slate-800 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-slate-700/50"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                stroke-width="2.5"
              />
            </svg>
          </button>
        </div>
      </template>
    </AppTable>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppTable from '@/components/ui/AppTable.vue'
import { useAuthStore } from '@/stores/authStore' // 👈 استيراد الستور

const props = defineProps({
  items: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
})

const emit = defineEmits(['edit', 'delete', 'row-click'])

const auth = useAuthStore() // 👈 تفعيل الستور

// تصفية الهيدرز ديناميكياً بناءً على الصلاحيات
const filteredHeaders = computed(() => {
  const baseHeaders = [
    { key: 'RequestNo', label: 'رقم المرجع' },
    { key: 'Department', label: 'الجهة المنظمة' },
    { key: 'RequiredMajor', label: 'اسم الدورة التدريبية' },
    { key: 'ApplyLink', label: 'بوابة التسجيل' },
    { key: 'ApplicationsCount', label: 'المتدربين' },
    { key: 'Status', label: 'الحالة' },
  ]

  if (auth.can('job_request.update') || auth.can('job_request.delete')) {
    baseHeaders.push({ key: 'actions', label: 'الإجراءات', class: 'w-24' })
  }

  return baseHeaders
})

const copyToClipboard = (text) => {
  if (!text) return
  const fixedLink = text.replace('/apply/', '/training/')
  navigator.clipboard.writeText(fixedLink).then(() => {
    alert('تم نسخ رابط التسجيل بنجاح.')
  })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'مفتوح':
    case 'Open':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    case 'مغلق':
    case 'Closed':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    default:
      return 'bg-slate-800 text-slate-400 border-slate-700'
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&display=swap');
:deep(table) {
  font-family: 'Almarai', sans-serif;
  @apply bg-[#0f172a] border-separate border-spacing-0;
}
:deep(th) {
  @apply bg-[#1e293b] text-slate-400 font-black text-[11px] py-4 border-b border-slate-800 text-right px-6 uppercase tracking-wider;
}
:deep(td) {
  @apply py-4 px-6 border-b border-slate-800/50 align-middle transition-colors text-slate-300;
}
:deep(tr:hover td) {
  @apply bg-slate-800/40;
}
</style>
