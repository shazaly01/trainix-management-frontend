<template>
  <AppCard class="max-w-4xl mx-auto mt-10 p-6 shadow-lg bg-surface-ground">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-text-primary">بوابة التوظيف - تقديم طلب جديد</h1>
      <p class="text-text-muted mt-2">الرجاء إكمال الخطوات التالية لبناء ملفك الشخصي</p>
    </div>

    <AppStepper :steps="stepNames" :currentStep="currentStep" />

    <div class="mt-8 transition-all duration-300">
      <component
        :is="currentStepComponent"
        :applicantId="applicantId"
        @step-completed="handleStepCompleted"
        @go-back="prevStep"
      />
    </div>
  </AppCard>
</template>

<script setup>
import { ref, markRaw, computed } from 'vue'
import AppCard from '@/ui/AppCard.vue' // تأكد من صحة المسار
import AppStepper from '@/ui/AppStepper.vue'

// هنا سنستورد المكونات الخاصة بالخطوات (سننشئها في الخطوة القادمة)
// استخدمنا تعريفات وهمية مؤقتاً حتى لا يحدث خطأ في الـ Vue
import Step1_BasicInfo from './steps/Step1_BasicInfo.vue'
import Step2_Qualifications from './steps/Step2_Qualifications.vue'
import Step3_Experiences from './steps/Step3_Experiences.vue'
import Step4_Skills from './steps/Step4_Skills.vue'
import Step5_Documents from './steps/Step5_Documents.vue'
import Step6_ReviewSubmit from './steps/Step6_ReviewSubmit.vue'

// -- حالة المكون (State) --
const currentStep = ref(1)
const applicantId = ref(null) // هذا هو المفتاح السحري الذي سيربط كل شيء!

const stepNames = [
  'البيانات الأساسية',
  'المؤهلات العلمية',
  'الخبرات المهنية',
  'المهارات',
  'المرفقات',
  'المراجعة والتقديم',
]

// مصفوفة المكونات باستخدام markRaw لتحسين الأداء (منع Vue من تتبع المكون نفسه كـ Reactive)
const components = [
  markRaw(Step1_BasicInfo),
  markRaw(Step2_Qualifications),
  markRaw(Step3_Experiences),
  markRaw(Step4_Skills),
  markRaw(Step5_Documents),
  markRaw(Step6_ReviewSubmit),
]

// حساب المكون الذي يجب عرضه الآن
const currentStepComponent = computed(() => components[currentStep.value - 1])

// -- الدوال (Methods) --

// هذه الدالة سيتم استدعاؤها من المكونات الأبناء عندما يضغط المستخدم "التالي" وينجح الحفظ
const handleStepCompleted = (payload) => {
  // إذا كنا في الخطوة الأولى، سنستلم الـ ID الخاص بالمتقدم لحفظه
  if (currentStep.value === 1 && payload?.applicantId) {
    applicantId.value = payload.applicantId
  }

  // الانتقال للخطوة التالية
  if (currentStep.value < components.length) {
    currentStep.value++
  }
}

// دالة العودة للخطوة السابقة
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}
</script>
