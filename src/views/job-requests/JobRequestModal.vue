<!--src\views\job-requests\JobRequestModal.vue-->
<template>
  <AppDialog
    :model-value="isOpen"
    :title="isEditing ? 'تعديل طلب توظيف' : 'إضافة طلب توظيف جديد'"
    @update:model-value="closeModal"
  >
    <div
      v-if="jobRequestStore.error"
      class="mb-4 p-3 rounded-lg bg-danger/10 text-danger text-sm border border-danger/20"
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
    console.error(error)
  }
}
</script>
