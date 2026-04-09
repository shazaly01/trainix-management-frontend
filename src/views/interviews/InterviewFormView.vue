<template>
  <div class="max-w-7xl mx-auto pb-20 animate-fade-in px-4">
    <div
      class="sticky top-0 z-30 bg-surface-ground/95 backdrop-blur-md border-b border-surface-border mb-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div class="flex items-center gap-4">
        <button
          @click="router.push({ name: 'InterviewsList' })"
          class="p-2.5 hover:bg-surface-section rounded-xl transition-all text-text-muted hover:text-primary border border-surface-border shadow-sm"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-black text-text-primary tracking-tight">
            {{ isEditing ? 'تعديل وتقييم المقابلة' : 'جدولة مقابلة جديدة' }}
          </h1>
          <p class="text-text-muted text-sm mt-0.5">
            {{
              isEditing
                ? 'إدارة نتائج التقييم للمرشحين'
                : 'بناء جلسة اختيار قائمة على الكفاءة المهنية'
            }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <AppButton variant="secondary" @click="router.push({ name: 'InterviewsList' })">
          إلغاء التغييرات
        </AppButton>
        <AppButton
          variant="primary"
          :loading="interviewStore.loading"
          :disabled="candidatesData.length === 0"
          @click="handleSave"
          class="shadow-lg shadow-primary/20"
        >
          <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          {{ isEditing ? 'تحديث البيانات والنتائج' : 'اعتماد وحفظ الجلسة' }}
        </AppButton>
      </div>
    </div>

    <div
      v-if="interviewStore.error"
      class="mb-8 p-4 rounded-xl bg-danger/10 text-danger border border-danger/20 flex items-center gap-3"
    >
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span class="font-bold">{{ interviewStore.error }}</span>
    </div>

    <div class="grid grid-cols-1 gap-10">
      <section>
        <InterviewMasterForm v-model="masterData" :is-editing="isEditing" />
      </section>

      <section>
        <InterviewCandidatesTable
          v-model:candidates="candidatesData"
          :is-evaluating="isEditing"
          @open-selector="isSelectorOpen = true"
        />
      </section>
    </div>

    <SelectCandidatesModal
      :is-open="isSelectorOpen"
      :job-request-id="masterData.job_request_id"
      :already-selected-ids="selectedApplicationIds"
      @close="isSelectorOpen = false"
      @select="handleCandidatesAdded"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInterviewStore } from '@/stores/interviewStore'
import AppButton from '@/components/ui/AppButton.vue'

// المكونات الفرعية
import InterviewMasterForm from './components/InterviewMasterForm.vue'
import InterviewCandidatesTable from './components/InterviewCandidatesTable.vue'
import SelectCandidatesModal from './components/SelectCandidatesModal.vue'

const route = useRoute()
const router = useRouter()
const interviewStore = useInterviewStore()

// --- الحالة (State) ---
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

// --- Computed ---
const isEditing = computed(() => !!route.params.id)
const selectedApplicationIds = computed(() =>
  candidatesData.value.map((c) => Number(c.application_id)),
)

// --- Actions ---

onMounted(async () => {
  if (isEditing.value) {
    try {
      await interviewStore.fetchInterview(route.params.id)
      if (interviewStore.currentInterview) {
        const session = interviewStore.currentInterview

        // تعبئة البيانات الأساسية
        masterData.value = {
          job_request_id: session.job_request_id,
          EmpCode: session.EmpCode,
          InterviewDate: session.InterviewDate,
          Location: session.Location || '',
          Notes: session.Notes || '',
          Status: session.Status || 'Scheduled',
        }

        // تعبئة قائمة المرشحين
        if (session.Details) {
          candidatesData.value = session.Details.map((detail) => ({
            id: detail.id,
            application_id: detail.application_id,
            applicant_name: detail.application?.applicant
              ? `${detail.application.applicant.FirstName} ${detail.application.applicant.LastName}`
              : 'مرشح مجهول',
            InterviewTime: detail.InterviewTime,
            EvaluationScore: detail.EvaluationScore,
            Result: detail.Result || 'Pending',
            Notes: detail.Notes || '',
          }))
        }
      }
    } catch (err) {
      console.error('فشل في تحميل بيانات الجلسة:', err)
    }
  }
})

/**
 * ✅ حل مشكلة عدم ظهور المرشحين عند الضغط على "اعتماد"
 */
const handleCandidatesAdded = (newCandidates) => {
  console.log('استلام مرشحين جدد:', newCandidates)

  if (newCandidates && newCandidates.length > 0) {
    // تحديث المصفوفة باستخدام الـ Spread Operator لضمان تفاعل Vue (Reactivity)
    candidatesData.value = [...candidatesData.value, ...newCandidates]

    // إغلاق النافذة بنجاح
    isSelectorOpen.value = false
  }
}

const handleSave = async () => {
  // التحقق من الحقول الإجبارية
  if (
    !masterData.value.job_request_id ||
    !masterData.value.EmpCode ||
    !masterData.value.InterviewDate
  ) {
    interviewStore.error = 'يرجى إكمال بيانات الجلسة الأساسية أولاً.'
    return
  }

  const payload = {
    ...masterData.value,
    candidates: candidatesData.value,
  }

  try {
    if (isEditing.value) {
      await interviewStore.updateInterview(route.params.id, payload)
    } else {
      await interviewStore.createInterview(payload)
    }

    // الانتقال للقائمة بعد النجاح
    router.push({ name: 'InterviewsList' })
  } catch (error) {
    console.error('فشل عملية الحفظ:', error)
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
