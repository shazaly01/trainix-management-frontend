<template>
  <AppTable
    :headers="headers"
    :items="items"
    :isLoading="isLoading"
    @row-click="$emit('row-click', $event)"
  >
    <template #cell-RequestNo="{ item }">
      <div class="flex items-center gap-2">
        <span class="font-mono text-primary font-semibold bg-primary/10 px-2 py-1 rounded">
          {{ item.RequestNo }}
        </span>
      </div>
    </template>

    <template #cell-Department="{ item }">
      <span class="text-text-primary">
        {{ item.Department?.Name || 'غير محدد' }}
      </span>
    </template>

    <template #cell-ApplicationsCount="{ item }">
      <span
        class="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-bold"
      >
        {{ item.ApplicationsCount || 0 }}
      </span>
    </template>

    <template #cell-ApplyLink="{ item }">
      <button
        v-if="item.ApplyLink"
        @click.stop="copyToClipboard(item.ApplyLink)"
        class="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors bg-primary/5 px-2 py-1 rounded border border-primary/20"
        title="نسخ رابط التقديم المباشر"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
        نسخ الرابط
      </button>
      <span v-else class="text-text-muted text-xs italic">غير متوفر</span>
    </template>

    <template #cell-Status="{ item }">
      <span
        class="px-3 py-1 text-xs rounded-full font-medium border"
        :class="getStatusClass(item.Status)"
      >
        {{ item.Status || 'مفتوح' }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center gap-3">
        <button
          @click.stop="$emit('edit', item)"
          class="text-blue-500 hover:text-blue-700 transition-colors"
          title="تعديل الطلب"
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          @click.stop="$emit('delete', item.id)"
          class="text-red-500 hover:text-red-700 transition-colors"
          title="حذف الطلب"
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
import { ref } from 'vue'
import AppTable from '@/components/ui/AppTable.vue'

defineProps({
  items: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['edit', 'delete', 'row-click'])

// أعمدة الجدول المحدثة
const headers = ref([
  { key: 'RequestNo', label: 'رقم الطلب' },
  { key: 'Department', label: 'الإدارة' },
  { key: 'RequiredMajor', label: 'التخصص المطلوب' },
  { key: 'ApplyLink', label: 'رابط التقديم' }, // ✅ العمود الجديد
  { key: 'ApplicationsCount', label: 'المتقدمين' },
  { key: 'Status', label: 'الحالة' },
  { key: 'actions', label: 'الإجراءات', class: 'text-left' },
])

// دالة نسخ الرابط
const copyToClipboard = (text) => {
  if (!text) return
  navigator.clipboard
    .writeText(text)
    .then(() => {
      // يمكنك استبدال alert بـ Toast إذا كان متوفراً لديك
      alert('تم نسخ رابط التقديم بنجاح')
    })
    .catch((err) => {
      console.error('فشل النسخ:', err)
    })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'مفتوح':
    case 'Open':
      return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400'
    case 'مغلق':
    case 'Closed':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
    case 'معلق':
    case 'Pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400'
    default:
      return 'bg-surface-ground text-text-secondary border-surface-border'
  }
}
</script>
