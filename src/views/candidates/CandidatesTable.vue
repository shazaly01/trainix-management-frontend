<template>
  <AppTable
    :headers="headers"
    :items="items"
    :isLoading="isLoading"
    @row-click="$emit('row-click', $event)"
  >
    <template #cell-SequenceNo="{ item }">
      <div class="flex items-center gap-2">
        <span class="font-mono text-primary font-semibold bg-primary/10 px-2 py-1 rounded">
          {{ item.SequenceNo || '---' }}
        </span>
      </div>
    </template>

    <template #cell-Name="{ item }">
      <span class="text-text-primary font-medium">
        {{ item.Name }}
      </span>
    </template>

    <template #cell-NationalNo="{ item }">
      <span class="font-mono text-text-secondary text-sm">
        {{ item.NationalNo || 'غير متوفر' }}
      </span>
    </template>

    <template #cell-Phone="{ item }">
      <span class="text-text-secondary text-sm" dir="ltr">
        {{ item.Phone || 'غير متوفر' }}
      </span>
    </template>

    <template #cell-Residence="{ item }">
      <span class="text-text-secondary text-sm">
        {{ item.Residence || '---' }}
      </span>
    </template>

    <template #cell-Size="{ item }">
      <span
        v-if="item.Size"
        class="bg-surface-ground border border-surface-border px-2 py-0.5 rounded text-xs font-bold text-text-secondary"
      >
        {{ item.Size }}
      </span>
      <span v-else class="text-text-muted text-xs">---</span>
    </template>

    <template #cell-IsFit="{ item }">
      <span
        class="px-2 py-1 text-xs rounded-full font-bold border"
        :class="
          item.IsFit
            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400'
            : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
        "
      >
        {{ item.IsFit ? 'لائق' : 'غير لائق' }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center gap-3">
        <button
          @click.stop="$emit('edit', item)"
          class="text-blue-500 hover:text-blue-700 transition-colors"
          title="تعديل بيانات المترشح"
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
          title="حذف المترشح"
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

// أعمدة الجدول المخصصة للمترشحين بناءً على الحقول التي أنشأناها
const headers = ref([
  { key: 'SequenceNo', label: 'التسلسل' },
  { key: 'Name', label: 'الاسم رباعي' },
  { key: 'NationalNo', label: 'الرقم الوطني' },
  { key: 'Phone', label: 'رقم الهاتف' },
  { key: 'Residence', label: 'السكن' },
  { key: 'Size', label: 'المقاس' },
  { key: 'IsFit', label: 'حالة اللياقة' },
  { key: 'actions', label: 'الإجراءات', class: 'text-left' },
])
</script>
