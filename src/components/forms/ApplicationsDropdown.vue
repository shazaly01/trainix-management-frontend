<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="displayOptions"
      option-label="displayName"
      option-value="id"
      :loading="loading"
      :required="required"
      placeholder="اختر طلب التوظيف للمقابلة"
    />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useApplicationStore } from '@/stores/applicationStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue'

defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'طلب التوظيف' },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const applicationStore = useApplicationStore()
const { applications, loading } = storeToRefs(applicationStore)

// دمج اسم المتقدم مع اسم الوظيفة للعرض في القائمة
const displayOptions = computed(() => {
  return applications.value.map((app) => ({
    id: app.id,
    displayName: `${app.applicant?.FirstName} ${app.applicant?.LastName} - (${app.job_request?.JobTitle})`,
  }))
})

onMounted(async () => {
  if (applications.value.length === 0) {
    await applicationStore.fetchApplications()
  }
})
</script>
