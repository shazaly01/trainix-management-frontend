<template>
  <AppTable
    :headers="headers"
    :items="items"
    :isLoading="isLoading"
    @row-click="$emit('row-click', $event)"
  >
    <template #cell-ApplicantIdentifier="{ item }">
      <div class="flex flex-col">
        <span class="font-mono text-primary font-semibold">
          {{ item.ApplicantNo }}
        </span>
        <span v-if="item.ReferenceCode && !item.FirstName" class="text-xs text-text-muted">
          كود: {{ item.ReferenceCode }}
        </span>
      </div>
    </template>

    <template #cell-FullName="{ item }">
      <span v-if="item.FirstName || item.LastName" class="font-medium text-text-primary">
        {{ item.FirstName }} {{ item.LastName }}
      </span>
      <span v-else class="text-text-muted italic bg-surface-ground px-2 py-1 rounded text-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3 inline mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.188-1.583c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29"
          />
        </svg>
        مخفي (توظيف مجهول)
      </span>
    </template>

    <template #cell-ApplicationSource="{ item }">
      <span
        class="text-sm border border-surface-border px-2 py-1 rounded bg-surface-ground text-text-secondary"
      >
        {{ item.ApplicationSource || '-' }}
      </span>
    </template>

    <template #cell-IsActive="{ item }">
      <span
        v-if="item.IsActive !== undefined"
        class="px-3 py-1 text-xs rounded-full font-medium"
        :class="item.IsActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
      >
        {{ item.IsActive ? 'نشط' : 'غير نشط' }}
      </span>
      <span v-else class="text-text-muted">-</span>
    </template>

    <template #cell-actions="{ item }">
      <button
        @click.stop="$emit('view-profile', item.id)"
        class="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm font-medium"
      >
        <span>عرض الملف</span>
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
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </button>
    </template>
  </AppTable>
</template>

<script setup>
import { ref } from 'vue'
import AppTable from '@/components/ui/AppTable.vue'

defineProps({
  items: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
})

defineEmits(['view-profile', 'row-click'])

const headers = ref([
  { key: 'ApplicantIdentifier', label: 'رقم المتقدم / المرجع' },
  { key: 'FullName', label: 'اسم المتقدم' },
  { key: 'ApplicationSource', label: 'المصدر' },
  { key: 'IsActive', label: 'الحالة' },
  { key: 'RegisteredAt', label: 'تاريخ التسجيل' },
  { key: 'actions', label: 'الإجراءات', class: 'text-left' },
])
</script>
