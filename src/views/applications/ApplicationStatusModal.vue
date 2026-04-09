<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="bg-surface-ground rounded-xl shadow-xl w-full max-w-md overflow-hidden">
      <div class="p-5 border-b border-surface-border flex justify-between items-center">
        <h3 class="text-lg font-bold text-text-primary">تحديث حالة التقديم</h3>
        <button @click="$emit('close')" class="text-text-muted hover:text-danger">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div
          v-if="application"
          class="bg-surface-section p-3 rounded border border-surface-border text-sm mb-4"
        >
          <p class="text-text-secondary">
            رقم الحركة: <span class="text-primary font-mono">{{ application.TransactionNo }}</span>
          </p>
          <p class="text-text-secondary mt-1">
            الحالة الحالية:
            <span class="font-bold">{{ application.ApplicationStatus || 'Pending' }}</span>
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1"
            >تحديد الحالة الجديدة</label
          >
          <select
            v-model="newStatus"
            class="w-full px-4 py-2 border border-surface-border rounded-lg bg-surface-ground focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="Pending">جديد (Pending)</option>
            <option value="Under Review">قيد المراجعة (Under Review)</option>
            <option value="Interview">مؤهل للمقابلة (Interview)</option>
            <option value="Accepted">مقبول نهائياً (Accepted)</option>
            <option value="Rejected">مرفوض (Rejected)</option>
          </select>
        </div>
      </div>

      <div class="p-5 border-t border-surface-border flex justify-end gap-3 bg-surface-section">
        <button
          @click="$emit('close')"
          class="px-5 py-2 rounded-lg border border-surface-border text-text-primary hover:bg-surface-border transition-colors"
        >
          إلغاء
        </button>
        <button
          @click="saveStatus"
          :disabled="isLoading"
          class="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <span v-if="isLoading">جاري الحفظ...</span>
          <span v-else>حفظ التغييرات</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  application: { type: Object, default: null },
  isLoading: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'save'])

const newStatus = ref('Pending')

// تحديث القائمة المنسدلة تلقائياً بناءً على حالة الطلب المحدد
watch(
  () => props.application,
  (newVal) => {
    if (newVal) {
      newStatus.value = newVal.ApplicationStatus || 'Pending'
    }
  },
)

const saveStatus = () => {
  emit('save', { id: props.application.id, status: newStatus.value })
}
</script>
