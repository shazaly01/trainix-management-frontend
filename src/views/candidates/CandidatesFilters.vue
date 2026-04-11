<template>
  <div class="bg-surface-ground border border-surface-border p-6 rounded-[1.5rem] mb-6 shadow-sm">
    <div class="flex items-center gap-2 mb-6 pb-3 border-b border-surface-border/50">
      <svg
        class="w-5 h-5 text-text-secondary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        />
      </svg>
      <h3 class="text-sm font-bold text-text-secondary">تصفية نتائج المترشحين</h3>
    </div>

    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <AppInput
          v-model="filters.search"
          id="search"
          label="بحث عام"
          placeholder="الاسم، الرقم الوطني..."
        />
        <AppInput
          v-model="filters.Residence"
          id="filter_residence"
          label="المدينة / السكن"
          placeholder="مثال: بنغازي"
        />
        <AppInput
          v-model="filters.Qualification"
          id="filter_qualification"
          label="المؤهل العلمي"
          placeholder="مثال: هندسة"
        />
        <AppInput
          v-model="filters.ShoeSize"
          id="filter_shoe_size"
          type="number"
          label="رقم الحذاء"
          placeholder="مثال: 42"
        />
      </div>

      <hr class="border-surface-border/40" />

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
        <div class="flex flex-col">
          <label class="block text-[13px] font-bold text-text-primary mb-1.5 ml-1">مقاس الزي</label>
          <select
            v-model="filters.Size"
            class="w-full h-[42px] bg-white dark:bg-surface-section border border-surface-border text-text-primary text-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary block px-3 outline-none transition-all cursor-pointer"
          >
            <option value="">الكل</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="2XL">2XL</option>
            <option value="3XL">3XL</option>
          </select>
        </div>

        <div class="flex flex-col">
          <label class="block text-[13px] font-bold text-text-primary mb-1.5 ml-1"
            >حالة اللياقة</label
          >
          <select
            v-model="filters.IsFit"
            class="w-full h-[42px] bg-white dark:bg-surface-section border border-surface-border text-text-primary text-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary block px-3 outline-none transition-all cursor-pointer"
          >
            <option value="">الكل</option>
            <option value="1">لائق طبياً فقط</option>
            <option value="0">غير لائق فقط</option>
          </select>
        </div>

        <div class="flex flex-col">
          <label class="block text-[13px] font-bold text-text-primary mb-1.5 ml-1"
            >نوع التدريب</label
          >
          <select
            v-model="filters.TrainingType"
            class="w-full h-[42px] bg-white dark:bg-surface-section border border-surface-border text-text-primary text-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary block px-3 outline-none transition-all cursor-pointer font-bold"
          >
            <option value="">الكل</option>
            <option value="internal" class="text-blue-600">تدريب داخلي</option>
            <option value="external" class="text-purple-600">تدريب خارجي</option>
          </select>
        </div>

        <div class="h-[42px]">
          <AppButton
            type="button"
            variant="secondary"
            @click="resetFilters"
            class="w-full h-full flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            إعادة ضبط الفلاتر
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['filter'])

const filters = ref({
  search: '',
  Residence: '',
  Size: '',
  ShoeSize: '',
  IsFit: '',
  TrainingType: '',
  Qualification: '',
})

let debounceTimeout = null

const emitFilters = () => {
  const activeFilters = {}
  if (filters.value.search) activeFilters.search = filters.value.search
  if (filters.value.Residence) activeFilters.Residence = filters.value.Residence
  if (filters.value.Size) activeFilters.Size = filters.value.Size
  if (filters.value.ShoeSize) activeFilters.ShoeSize = filters.value.ShoeSize
  if (filters.value.IsFit !== '') activeFilters.IsFit = filters.value.IsFit
  if (filters.value.TrainingType) activeFilters.TrainingType = filters.value.TrainingType
  if (filters.value.Qualification) activeFilters.Qualification = filters.value.Qualification

  emit('filter', activeFilters)
}

watch(
  filters,
  () => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      emitFilters()
    }, 500)
  },
  { deep: true },
)

const resetFilters = () => {
  filters.value = {
    search: '',
    Residence: '',
    Size: '',
    ShoeSize: '',
    IsFit: '',
    TrainingType: '',
    Qualification: '',
  }
}
</script>
