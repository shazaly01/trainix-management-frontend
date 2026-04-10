<!--src\views\candidates\CandidatesTable.vue--->
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

    <template #cell-PersonalInfo="{ item }">
      <div class="flex flex-col gap-1">
        <span class="text-text-primary text-sm font-medium">
          {{ item.Qualification || 'بدون مؤهل' }}
        </span>
        <div v-if="item.BirthDate" class="flex items-center gap-2">
          <span class="text-text-muted text-xs flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {{ item.BirthDate }}
          </span>
          <span
            class="text-[10px] font-bold bg-surface-ground px-1.5 py-0.5 rounded border border-surface-border"
          >
            {{ new Date().getFullYear() - new Date(item.BirthDate).getFullYear() }} سنة
          </span>
        </div>
      </div>
    </template>

    <template #cell-NationalNo="{ item }">
      <span class="font-mono text-text-secondary text-sm">
        {{ item.NationalNo || 'غير متوفر' }}
      </span>
    </template>

    <template #cell-PassportInfo="{ item }">
      <div class="flex flex-col gap-1">
        <span class="font-mono text-text-primary text-sm">
          {{ item.PassportNo || 'لا يوجد جواز' }}
        </span>
        <span v-if="item.PassportExpiry" class="text-text-muted text-xs flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ item.PassportExpiry }}
        </span>
      </div>
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

    <template #cell-Notes="{ item }">
      <div
        class="max-w-[120px] truncate text-text-secondary text-xs cursor-help"
        :title="item.Notes"
      >
        {{ item.Notes || '---' }}
      </div>
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

// تم تعديل مصفوفة الأعمدة لتعكس الحقول الجديدة المدمجة
const headers = ref([
  { key: 'SequenceNo', label: 'التسلسل' },
  { key: 'Name', label: 'الاسم رباعي' },
  { key: 'PersonalInfo', label: 'بيانات شخصية' }, // تم دمج المؤهل وتاريخ الميلاد هنا
  { key: 'NationalNo', label: 'الرقم الوطني' },
  { key: 'PassportInfo', label: 'بيانات الجواز' }, // تم دمج رقم الجواز وتاريخ الانتهاء هنا
  { key: 'Phone', label: 'رقم الهاتف' },
  { key: 'Residence', label: 'السكن' },
  { key: 'Size', label: 'المقاس' },
  { key: 'IsFit', label: 'حالة اللياقة' },
  { key: 'Notes', label: 'ملاحظات' }, // تمت إضافة الملاحظات
  { key: 'actions', label: 'الإجراءات', class: 'text-left' },
])
</script>
