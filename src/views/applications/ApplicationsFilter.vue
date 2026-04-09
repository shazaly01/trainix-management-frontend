<template>
  <div class="bg-surface-section p-4 rounded-xl shadow-sm border border-surface-border mb-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="col-span-1 md:col-span-2">
        <label class="block text-sm font-medium text-text-secondary mb-1">بحث عام</label>
        <input
          v-model="filters.search"
          @input="emitFilters"
          type="text"
          placeholder="ابحث برقم الحركة، اسم المتقدم، أو رقم الطلب..."
          class="w-full px-4 py-2 border border-surface-border rounded-lg bg-surface-ground focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
        />
      </div>

      <div class="col-span-1">
        <label class="block text-sm font-medium text-text-secondary mb-1">حالة التقديم</label>
        <select
          v-model="filters.status"
          @change="emitFilters"
          class="w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-ground focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
        >
          <option value="">الكل</option>
          <option value="Pending">جديد (Pending)</option>
          <option value="Under Review">قيد المراجعة (Under Review)</option>
          <option value="Interview">مؤهل للمقابلة (Interview)</option>
          <option value="Accepted">مقبول (Accepted)</option>
          <option value="Rejected">مرفوض (Rejected)</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['filter'])

const filters = reactive({
  search: '',
  status: '',
})

let timeout = null
const emitFilters = () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    emit('filter', { ...filters })
  }, 400)
}
</script>
