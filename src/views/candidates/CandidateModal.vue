<template>
  <AppDialog
    :model-value="isOpen"
    :title="isEditing ? 'تعديل بيانات المترشح' : 'إضافة مترشح جديد'"
    @update:model-value="closeModal"
  >
    <div
      v-if="candidateStore.error"
      class="mb-4 p-3 rounded-lg bg-danger/10 text-danger text-sm border border-danger/20"
    >
      {{ candidateStore.error }}
    </div>

    <CandidateForm
      :initial-data="candidateToEdit"
      :loading="candidateStore.loading"
      @submit="handleSave"
      @cancel="closeModal"
    />
  </AppDialog>
</template>

<script setup>
import { computed } from 'vue'
import { useCandidateStore } from '@/stores/candidateStore'
import AppDialog from '@/components/ui/AppDialog.vue'
import CandidateForm from './CandidateForm.vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  candidateToEdit: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])
const candidateStore = useCandidateStore()

// التحقق مما إذا كنا في وضع التعديل أم الإضافة
const isEditing = computed(() => !!props.candidateToEdit)

// دالة إغلاق المودال وتصفير الأخطاء
const closeModal = () => {
  candidateStore.error = null
  emit('close')
}

// دالة الحفظ التي تستقبل الـ FormData من الـ CandidateForm
const handleSave = async (formData) => {
  try {
    if (isEditing.value) {
      // إرسال البيانات للتعديل
      await candidateStore.updateCandidate(props.candidateToEdit.id, formData)
    } else {
      // إرسال البيانات للإضافة
      await candidateStore.createCandidate(formData)
    }

    // إذا تمت العملية بنجاح ولم يقم السيرفر بإرجاع خطأ
    if (!candidateStore.error) {
      emit('saved')
      closeModal()
    }
  } catch (error) {
    console.error('حدث خطأ أثناء حفظ بيانات المترشح:', error)
  }
}
</script>
