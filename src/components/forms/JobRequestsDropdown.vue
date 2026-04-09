<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="formattedRequests"
      option-label="displayName"
      option-value="id"
      :loading="jobRequestStore.loading"
      :required="required"
      :filter="true"
      filter-placeholder="ابحث برقم الطلب أو التخصص..."
      placeholder="اختر طلب التوظيف المستهدف"
    />
    <p v-if="jobRequestStore.error" class="text-sm text-danger mt-1">{{ jobRequestStore.error }}</p>
  </div>
</template>
<script setup>
import { onMounted, computed } from 'vue'
import { useJobRequestStore } from '@/stores/jobRequestStore'
import AppDropdown from '@/components/ui/AppDropdown.vue'

defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'طلب التوظيف المستهدف' },
  modelValue: { type: [String, Number, null], default: null },
  required: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const jobRequestStore = useJobRequestStore()

/**
 * معالجة البيانات:
 * لاحظ استخدام المسمى الصحيح: openJobRequests
 */
const formattedRequests = computed(() => {
  // ✅ التعديل هنا: استخدام المسمى المطابق للـ Store
  const rawData = jobRequestStore.openJobRequests?.data || jobRequestStore.openJobRequests || []

  if (!Array.isArray(rawData)) return []

  return rawData.map((request) => ({
    ...request,
    displayName: `طلب #${request?.RequestNo || ''} - ${request?.RequiredMajor || 'بدون تخصص'}`,
  }))
})

onMounted(async () => {
  // ✅ التعديل هنا: استخدام المسمى المطابق للـ Store: fetchOpenJobRequests
  if (formattedRequests.value.length === 0) {
    try {
      if (typeof jobRequestStore.fetchOpenJobRequests === 'function') {
        await jobRequestStore.fetchOpenJobRequests()
      }
    } catch (err) {
      console.error('JobRequests Dropdown fetch error:', err)
    }
  }
})
</script>
