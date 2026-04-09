<template>
  <div class="bg-surface-section p-6 rounded-xl border border-surface-border mb-6 shadow-sm">
    <h3
      class="text-lg font-bold text-primary mb-6 border-b border-surface-border pb-3 flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      البيانات الأساسية لجلسة المقابلات
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <JobRequestsDropdown
        id="job_request_id"
        v-model="form.job_request_id"
        label="طلب التوظيف المستهدف (الوظيفة)"
        required
        :disabled="isEditing"
      />

      <AppInput
        id="emp_code"
        v-model="form.EmpCode"
        type="text"
        label="كود الموظف (المُقَيِّم/اللجنة)"
        placeholder="أدخل كود الموظف (مثال: 100234567)"
        required
      />

      <AppInput
        id="int_date"
        v-model="form.InterviewDate"
        type="date"
        label="تاريخ الجلسة"
        required
      />

      <AppInput
        id="location"
        v-model="form.Location"
        type="text"
        label="مكان المقابلة (أو رابط الاجتماع)"
        placeholder="مثال: قاعة الاجتماعات الرئيسية"
      />
    </div>

    <div class="mt-6">
      <AppTextarea
        id="notes"
        v-model="form.Notes"
        label="ملاحظات عامة على الجلسة"
        rows="3"
        placeholder="أي ملاحظات تخص هذه الجلسة ككل..."
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import JobRequestsDropdown from '@/components/forms/JobRequestsDropdown.vue'

const props = defineProps({
  // البيانات القادمة من الصفحة الكاملة (InterviewFormView)
  modelValue: {
    type: Object,
    required: true,
  },
  // وضع التعديل يمنع تغيير الوظيفة بعد الجدولة
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

// نسخة محلية للتعامل مع الحقول
const form = ref({ ...props.modelValue })

/**
 * ✅ حل مشكلة "Maximum recursive updates exceeded":
 * نراقب التغييرات القادمة من الأب (مثلاً عند تحميل بيانات التعديل)
 * ونحدث النسخة المحلية فقط إذا كانت البيانات مختلفة فعلياً.
 */
watch(
  () => props.modelValue,
  (newValue) => {
    const isDifferent = JSON.stringify(newValue) !== JSON.stringify(form.value)
    if (isDifferent) {
      form.value = { ...newValue }
    }
  },
  { deep: true },
)

/**
 * نراقب التغييرات المحلية التي يقوم بها المستخدم
 * ونرسلها للأب فقط إذا كانت مختلفة عن القيمة الأصلية.
 */
watch(
  form,
  (newValue) => {
    const isDifferent = JSON.stringify(newValue) !== JSON.stringify(props.modelValue)
    if (isDifferent) {
      emit('update:modelValue', { ...newValue })
    }
  },
  { deep: true },
)
</script>
