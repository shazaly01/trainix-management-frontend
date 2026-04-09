<!--src\views\interviews\InterviewSessionModal.vue-->
<template>
  <AppDialog
    :model-value="isOpen"
    :title="isEditing ? 'تقييم جلسة المقابلات' : 'جدولة جلسة مقابلات جديدة'"
    @update:model-value="closeModal"
    size="5xl"
  >
    <div
      v-if="interviewStore.error"
      class="mb-4 p-3 rounded-lg bg-danger/10 text-danger text-sm border border-danger/20"
    >
      {{ interviewStore.error }}
    </div>

    <InterviewMasterForm v-model="masterData" :is-editing="isEditing" />

    <InterviewCandidatesTable
      v-model:candidates="candidatesData"
      :is-evaluating="isEditing"
      @open-selector="isSelectorOpen = true"
    />

    <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-surface-border">
      <AppButton type="button" variant="secondary" @click="closeModal">إلغاء</AppButton>

      <AppButton
        type="button"
        variant="primary"
        :loading="interviewStore.loading"
        :disabled="interviewStore.loading || candidatesData.length === 0"
        @click="handleSave"
      >
        {{ isEditing ? 'حفظ الجلسة والتقييمات' : 'اعتماد وجدولة الجلسة' }}
      </AppButton>
    </div>

    <SelectCandidatesModal
      :is-open="isSelectorOpen"
      :job-request-id="masterData.job_request_id"
      :already-selected-ids="selectedApplicationIds"
      @close="isSelectorOpen = false"
      @select="handleCandidatesAdded"
    />
  </AppDialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useInterviewStore } from '@/stores/interviewStore'
import AppDialog from '@/components/ui/AppDialog.vue'
import AppButton from '@/components/ui/AppButton.vue'

import InterviewMasterForm from './components/InterviewMasterForm.vue'
import InterviewCandidatesTable from './components/InterviewCandidatesTable.vue'
import SelectCandidatesModal from './components/SelectCandidatesModal.vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  interviewToEdit: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])
const interviewStore = useInterviewStore()

// 1. التعريفات الأساسية (State)
const isSelectorOpen = ref(false)
const masterData = ref({
  job_request_id: null,
  EmpCode: null,
  InterviewDate: '',
  Location: '',
  Notes: '',
  Status: 'Scheduled',
})
const candidatesData = ref([])

const isEditing = computed(() => !!props.interviewToEdit)
const selectedApplicationIds = computed(() => candidatesData.value.map((c) => c.application_id))

// 2. ✅ الدوال المساعدة (يجب أن تكون قبل الـ Watcher)
const resetForm = () => {
  masterData.value = {
    job_request_id: null,
    EmpCode: null,
    InterviewDate: '',
    Location: '',
    Notes: '',
    Status: 'Scheduled',
  }
  candidatesData.value = []
  interviewStore.error = null
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const handleCandidatesAdded = (newCandidates) => {
  candidatesData.value.push(...newCandidates)
}

// 3. مراقبة التعديل (الآن أصبح resetForm معروفاً للـ Watcher)
watch(
  () => props.interviewToEdit,
  (newData) => {
    if (newData) {
      masterData.value = {
        job_request_id: newData.job_request_id,
        EmpCode: newData.EmpCode,
        InterviewDate: newData.InterviewDate,
        Location: newData.Location || '',
        Notes: newData.Notes || '',
        Status: newData.Status || 'Scheduled',
      }

      if (newData.Details) {
        candidatesData.value = newData.Details.map((detail) => ({
          id: detail.id,
          application_id: detail.application_id,
          applicant_name: detail.Application?.Applicant
            ? `${detail.Application.Applicant.FirstName} ${detail.Application.Applicant.LastName}`
            : 'مرشح',
          InterviewTime: detail.InterviewTime,
          EvaluationScore: detail.EvaluationScore,
          Result: detail.Result,
          Notes: detail.Notes,
        }))
      }
    } else {
      resetForm() // لن يظهر الخطأ الآن
    }
  },
  { immediate: true },
)
// دالة الحفظ الرئيسية (تجمع الرأس والتفاصيل وترسلهم للباك-أند)
const handleSave = async () => {
  // التحقق المبدئي (Validation)
  if (
    !masterData.value.job_request_id ||
    !masterData.value.EmpCode ||
    !masterData.value.InterviewDate
  ) {
    interviewStore.error = 'الرجاء إكمال البيانات الأساسية للجلسة (الوظيفة، المقيّم، والتاريخ).'
    return
  }

  if (candidatesData.value.length === 0) {
    interviewStore.error = 'لا يمكن جدولة جلسة بدون مرشحين. الرجاء إضافة مرشح واحد على الأقل.'
    return
  }

  // تجهيز الـ Payload النهائي بشكل مطابق لما ينتظره الـ Controller
  const payload = {
    ...masterData.value,
    candidates: candidatesData.value,
  }

  try {
    if (isEditing.value) {
      await interviewStore.updateInterview(props.interviewToEdit.id, payload)
    } else {
      await interviewStore.createInterview(payload)
    }

    // إذا لم يحدث خطأ في الباك-أند
    if (!interviewStore.error) {
      emit('saved')
      closeModal()
    }
  } catch (error) {
    console.error('Save failed:', error)
  }
}
</script>
