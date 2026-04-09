<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="formattedCities"
      option-label="Name"
      option-value="id"
      :loading="loading"
      :required="required"
      :filter="true"
      filter-placeholder="ابحث عن مدينة..."
      placeholder="اختر المدينة"
    />
    <p v-if="error" class="text-sm text-danger mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCityStore } from '@/stores/cityStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue'

defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'المدينة' },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const cityStore = useCityStore()

// ✅ التعديل هنا: نستخدم activeCities وليس cities
const { activeCities, loading, error } = storeToRefs(cityStore)

/**
 * معالجة البيانات:
 * الستور يضع response.data.data في activeCities
 * لذا activeCities ستكون هي المصفوفة المطلوبة مباشرة
 */
const formattedCities = computed(() => {
  // إذا كانت المصفوفة بداخل غلاف data إضافي (أحياناً يحدث في Laravel Resources)
  if (activeCities.value && activeCities.value.data) {
    return activeCities.value.data
  }
  return activeCities.value || []
})

onMounted(async () => {
  // ✅ التعديل هنا: نتحقق من activeCities ونستدعي الدالة الصحيحة
  if (formattedCities.value.length === 0) {
    try {
      await cityStore.fetchActiveCities()
    } catch (err) {
      console.error('Dropdown fetch error:', err)
    }
  }
})
</script>
