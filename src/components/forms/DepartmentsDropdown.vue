<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="activeDepartments"
      option-label="Name"
      option-value="id"
      :loading="loading"
      :required="required"
      placeholder="اختر الإدارة"
    />
    <p v-if="error" class="text-sm text-danger mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDepartmentStore } from '@/stores/departmentStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue'

defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'الإدارة' },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const departmentStore = useDepartmentStore()
// نستخدم activeDepartments التي جلبناها سابقاً
const { activeDepartments, loading } = storeToRefs(departmentStore)
const error = ref(null)

onMounted(async () => {
  if (activeDepartments.value.length === 0) {
    try {
      await departmentStore.fetchActiveDepartments()
    } catch (err) {
      error.value = 'فشل تحميل قائمة الإدارات.'
      console.error(err)
    }
  }
})
</script>
