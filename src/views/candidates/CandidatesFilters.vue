<template>
  <div class="bg-surface-ground border border-surface-border p-4 rounded-xl mb-6">
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
      <div class="lg:col-span-2">
        <AppInput
          v-model="filters.search"
          id="search"
          label="بحث"
          placeholder="ابحث بالاسم، الرقم الوطني..."
        />
      </div>

      <div>
        <AppInput
          v-model="filters.Residence"
          id="filter_residence"
          label="المدينة / السكن"
          placeholder="مثال: بنغازي"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-text-primary mb-1.5">المقاس</label>
        <select
          v-model="filters.Size"
          class="w-full bg-white dark:bg-surface-ground border border-surface-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none transition-colors"
        >
          <option value="">الكل</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="2XL">2XL</option>
          <option value="3XL">3XL</option>
          <option value="-42">-42</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-primary mb-1.5">حالة اللياقة</label>
        <select
          v-model="filters.IsFit"
          class="w-full bg-white dark:bg-surface-ground border border-surface-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none transition-colors"
        >
          <option value="">الكل</option>
          <option value="1">لائق طبياً فقط</option>
          <option value="0">غير لائق فقط</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-primary mb-1.5">نوع التدريب</label>
        <select
          v-model="filters.TrainingType"
          class="w-full bg-white dark:bg-surface-ground border border-surface-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none transition-colors font-bold"
        >
          <option value="">الكل</option>
          <option value="internal" class="text-blue-500">تدريب داخلي</option>
          <option value="external" class="text-purple-500">تدريب خارجي</option>
        </select>
      </div>

      <div class="md:col-span-3 lg:col-span-6 flex justify-end mt-2">
        <AppButton type="button" variant="secondary" @click="resetFilters" size="sm">
          مسح كل الفلاتر
        </AppButton>
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
  IsFit: '',
  TrainingType: '', // 👈 إضافة الحقل هنا
})

let debounceTimeout = null

const emitFilters = () => {
  const activeFilters = {}
  if (filters.value.search) activeFilters.search = filters.value.search
  if (filters.value.Residence) activeFilters.Residence = filters.value.Residence
  if (filters.value.Size) activeFilters.Size = filters.value.Size
  if (filters.value.IsFit !== '') activeFilters.IsFit = filters.value.IsFit
  if (filters.value.TrainingType) activeFilters.TrainingType = filters.value.TrainingType // 👈 إرساله للباك إند

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
    IsFit: '',
    TrainingType: '', // 👈 إعادة التعيين
  }
}
</script>
