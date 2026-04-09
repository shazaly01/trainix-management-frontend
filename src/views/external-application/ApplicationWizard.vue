<template>
  <div class="w-full mx-auto transition-all duration-300">
    <div class="mb-10">
      <AppStepper :steps="stepNames" :currentStep="currentStep" />
    </div>

    <div class="relative min-h-[400px]">
      <transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
        mode="out-in"
      >
        <component
          :is="currentStepComponent"
          :key="currentStep"
          :applicant-id="applicantId"
          :fixed-job-request-id="props.fixedJobRequestId"
          :fixed-job-title="props.fixedJobTitle"
          @step-completed="handleStepCompleted"
          @go-back="prevStep"
        />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw, computed } from 'vue'
import AppStepper from '@/components/ui/AppStepper.vue'

import Step1_BasicInfo from './steps/Step1_BasicInfo.vue'
import Step2_Qualifications from './steps/Step2_Qualifications.vue'
import Step3_Experiences from './steps/Step3_Experiences.vue'
import Step4_Skills from './steps/Step4_Skills.vue'
import Step5_Documents from './steps/Step5_Documents.vue'
import Step6_ReviewSubmit from './steps/Step6_ReviewSubmit.vue'

const props = defineProps({
  fixedJobRequestId: {
    type: [Number, String],
    default: null,
  },
  fixedJobTitle: {
    type: String,
    default: '',
  },
})

const currentStep = ref(1)
const applicantId = ref(null)

const stepNames = [
  'البيانات الأساسية',
  'المؤهلات العلمية',
  'الخبرات المهنية',
  'المهارات',
  'المرفقات',
  'التقديم',
]

const components = [
  markRaw(Step1_BasicInfo),
  markRaw(Step2_Qualifications),
  markRaw(Step3_Experiences),
  markRaw(Step4_Skills),
  markRaw(Step5_Documents),
  markRaw(Step6_ReviewSubmit),
]

const currentStepComponent = computed(() => components[currentStep.value - 1])

const handleStepCompleted = (payload) => {
  if (currentStep.value === 1 && payload?.applicantId) {
    applicantId.value = payload.applicantId
  }

  if (currentStep.value < components.length) {
    currentStep.value++
    // تمرير للأعلى بسلاسة عند الانتقال للخطوة التالية
    window.scrollTo({ top: 200, behavior: 'smooth' })
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 200, behavior: 'smooth' })
  }
}
</script>
