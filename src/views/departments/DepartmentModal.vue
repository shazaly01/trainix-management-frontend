<template>
  <AppDialog
    :model-value="isOpen"
    :title="isEditing ? 'تعديل الإدارة' : 'إضافة إدارة جديدة'"
    @update:model-value="closeModal"
  >
    <div
      v-if="departmentStore.error"
      class="mb-4 p-3 rounded-lg bg-danger/10 text-danger text-sm border border-danger/20"
    >
      {{ departmentStore.error }}
    </div>

    <DepartmentForm
      :initial-data="departmentToEdit"
      :loading="departmentStore.loading"
      @submit="handleSave"
      @cancel="closeModal"
    />
  </AppDialog>
</template>

<script setup>
import { computed } from 'vue'
import { useDepartmentStore } from '@/stores/departmentStore'
import AppDialog from '@/components/ui/AppDialog.vue'
import DepartmentForm from './DepartmentForm.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  departmentToEdit: {
    type: Object,
    default: () => null,
  },
})

const emit = defineEmits(['close', 'saved'])
const departmentStore = useDepartmentStore()

const isEditing = computed(() => !!props.departmentToEdit)

const closeModal = () => {
  departmentStore.error = null // تصفير الأخطاء
  emit('close')
}

const handleSave = async (formData) => {
  try {
    if (isEditing.value) {
      await departmentStore.updateDepartment(props.departmentToEdit.id, formData)
    } else {
      await departmentStore.createDepartment(formData)
    }

    // إغلاق وتحديث القائمة
    emit('saved')
    closeModal()
  } catch (error) {
    console.error('Save failed:', error)
  }
}
</script>
