<template>
  <AppDialog
    :model-value="isOpen"
    :title="isEditing ? 'تعديل الدورة التدريبية' : 'إضافة دورة تدريبية جديدة'"
    @update:model-value="closeModal"
  >
    <div
      v-if="jobRequestStore.error"
      class="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200 font-bold"
    >
      {{ jobRequestStore.error }}
    </div>

    <JobRequestForm
      :initial-data="jobRequestToEdit"
      :departments="departmentStore.activeDepartments"
      :loading="jobRequestStore.loading"
      @submit="handleSave"
      @cancel="closeModal"
    />
  </AppDialog>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useJobRequestStore } from '@/stores/jobRequestStore'
import { useDepartmentStore } from '@/stores/departmentStore'
import AppDialog from '@/components/ui/AppDialog.vue'
import JobRequestForm from './JobRequestForm.vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  jobRequestToEdit: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])
const jobRequestStore = useJobRequestStore()
const departmentStore = useDepartmentStore()

const isEditing = computed(() => !!props.jobRequestToEdit)

// جلب الإدارات فور فتح المودال
watch(
  () => props.isOpen,
  async (val) => {
    if (val && departmentStore.activeDepartments.length === 0) {
      await departmentStore.fetchActiveDepartments()
    }
  },
)

const closeModal = () => {
  jobRequestStore.error = null
  emit('close')
}

const handleSave = async (formData) => {
  try {
    if (isEditing.value) {
      await jobRequestStore.updateJobRequest(props.jobRequestToEdit.id, formData)
    } else {
      await jobRequestStore.createJobRequest(formData)
    }
    if (!jobRequestStore.error) {
      emit('saved')
      closeModal()
    }
  } catch (error) {
    console.error('حدث خطأ أثناء حفظ الدورة:', error)
  }
}
</script>
