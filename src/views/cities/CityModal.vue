<template>
  <AppDialog
    :model-value="isOpen"
    :title="isEditing ? 'تعديل مدينة' : 'إضافة مدينة جديدة'"
    @update:model-value="closeModal"
  >
    <div
      v-if="cityStore.error"
      class="mb-4 p-3 rounded-lg bg-danger/10 text-danger text-sm border border-danger/20"
    >
      {{ cityStore.error }}
    </div>

    <CityForm
      :initial-data="cityToEdit"
      :loading="cityStore.loading"
      @submit="handleSave"
      @cancel="closeModal"
    />
  </AppDialog>
</template>

<script setup>
import { computed } from 'vue'
import { useCityStore } from '@/stores/cityStore'
import AppDialog from '@/components/ui/AppDialog.vue'
import CityForm from './CityForm.vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  cityToEdit: { type: Object, default: null }, // تأكد من مطابقة الاسم مع الأب
})

const emit = defineEmits(['close', 'saved'])
const cityStore = useCityStore()
const isEditing = computed(() => !!props.cityToEdit)

const closeModal = () => {
  cityStore.error = null
  emit('close')
}

const handleSave = async (formData) => {
  try {
    if (isEditing.value) {
      await cityStore.updateCity(props.cityToEdit.id, formData)
    } else {
      await cityStore.createCity(formData)
    }
    if (!cityStore.error) {
      emit('saved')
      closeModal()
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
