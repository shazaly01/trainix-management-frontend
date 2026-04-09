<!--src\views\interviews\InterviewForm.vue-->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <ApplicationsDropdown
      id="application_id"
      v-model="form.application_id"
      label="طلب التوظيف المستهدف"
      required
      :disabled="isEditing"
    />

    <AppInput
      v-model="form.EmpCode"
      id="emp_code"
      type="number"
      label="كود الموظف (المُقَيِّم)"
      placeholder="أدخل كود الموظف DECIMAL(18,0)..."
      required
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInput
        v-model="form.InterviewDate"
        id="int_date"
        type="date"
        label="تاريخ المقابلة"
        required
      />
      <AppInput v-model="form.InterviewTime" type="time" label="وقت المقابلة" />
    </div>

    <div v-if="isEditing" class="pt-4 mt-4 border-t border-surface-border space-y-4">
      <h4 class="font-medium text-primary">نتائج التقييم</h4>

      <AppInput v-model="form.EvaluationScore" type="number" label="درجة التقييم (0-100)" />

      <AppTextarea v-model="form.Notes" label="ملاحظات المقابلة" rows="3" />

      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1">النتيجة</label>
        <select
          v-model="form.Result"
          class="w-full rounded-lg border border-surface-border bg-surface-section px-4 py-2 appearance-none"
        >
          <option value="Pending">قيد الانتظار</option>
          <option value="Passed">اجتاز</option>
          <option value="Failed">لم يجتز</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-surface-border">
      <AppButton type="button" variant="secondary" @click="$emit('cancel')">إلغاء</AppButton>
      <AppButton type="submit" variant="primary" :loading="loading" :disabled="loading">
        {{ isEditing ? 'حفظ التقييم' : 'جدولة المقابلة' }}
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppButton from '@/components/ui/AppButton.vue'
import ApplicationsDropdown from '@/components/forms/ApplicationsDropdown.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  application_id: '', // ✅ تم التعديل من applicant_id
  EmpCode: '',
  InterviewDate: '',
  InterviewTime: '',
  EvaluationScore: null,
  Notes: '',
  Result: 'Pending',
})

const isEditing = computed(() => !!props.initialData)

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = { ...newData }
    } else {
      form.value = {
        application_id: '',
        EmpCode: '',
        InterviewDate: '',
        InterviewTime: '',
        EvaluationScore: null,
        Notes: '',
        Result: 'Pending',
      }
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  // التأكد من إرسال البيانات كأرقام للحقول المطلوبة
  const payload = {
    ...form.value,
    EmpCode: Number(form.value.EmpCode),
    application_id: Number(form.value.application_id),
  }
  emit('submit', payload)
}
</script>
