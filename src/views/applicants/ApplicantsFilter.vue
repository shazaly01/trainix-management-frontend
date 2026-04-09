<template>
  <div class="bg-surface-section p-4 rounded-xl shadow-sm border border-surface-border mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="col-span-1 md:col-span-1">
        <label class="block text-sm font-medium text-text-secondary mb-1">بحث عام</label>
        <div class="relative">
          <input
            v-model="filters.search"
            @input="emitFilters"
            type="text"
            placeholder="الاسم، الرقم الوطني، أو رقم المتقدم..."
            class="w-full pl-4 pr-10 py-2 border border-surface-border rounded-lg bg-surface-ground focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div class="col-span-1">
        <label class="block text-sm font-medium text-text-secondary mb-1">المدينة</label>
        <select
          v-model="filters.city_id"
          @change="emitFilters"
          class="w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-ground focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
        >
          <option value="">الكل</option>
          <option v-for="city in activeCities" :key="city.id" :value="city.id">
            {{ city.Name }}
          </option>
        </select>
      </div>

      <div class="col-span-1">
        <label class="block text-sm font-medium text-text-secondary mb-1">مصدر التقديم</label>
        <select
          v-model="filters.source"
          @change="emitFilters"
          class="w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-ground focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
        >
          <option value="">الكل</option>
          <option value="داخلي">داخلي</option>
          <option value="خارجي">خارجي</option>
        </select>
      </div>

      <div class="col-span-1">
        <label class="block text-sm font-medium text-text-secondary mb-1">حالة الحساب</label>
        <select
          v-model="filters.is_active"
          @change="emitFilters"
          class="w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-ground focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
        >
          <option value="">الكل</option>
          <option value="1">نشط</option>
          <option value="0">غير نشط</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  activeCities: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['filter'])

const filters = reactive({
  search: '',
  city_id: '',
  source: '',
  is_active: '',
})

// استخدام Debounce للبحث النصي لعدم إرهاق السيرفر
let timeout = null
const emitFilters = () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    emit('filter', { ...filters })
  }, 400)
}
</script>
