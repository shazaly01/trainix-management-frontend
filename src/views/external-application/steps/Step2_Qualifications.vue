<template>
  <div class="animate-fade-in">
    <div class="mb-6 flex justify-between items-end">
      <div>
        <h2 class="text-xl font-bold text-text-primary">المؤهلات العلمية</h2>
        <p class="text-sm text-text-muted mt-1">يرجى إضافة مؤهلاتك العلمية بدءاً من الأحدث.</p>
      </div>
    </div>

    <div
      v-if="qualificationStore.error"
      class="mb-4 p-3 bg-danger/10 border-l-4 border-danger rounded text-danger text-sm"
    >
      {{ qualificationStore.error }}
    </div>

    <div class="bg-surface-ground border border-surface-border rounded-lg p-5 mb-8">
      <form @submit.prevent="addQualification">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AppDropdown
            v-model="form.DegreeLevel"
            label="الدرجة العلمية"
            :options="degreeOptions"
            optionLabel="label"
            optionValue="value"
            required
            placeholder="اختر الدرجة"
          />

          <AppInput
            v-model="form.Major"
            label="التخصص"
            required
            placeholder="مثال: هندسة برمجيات"
          />

          <AppInput
            v-model="form.UniversityOrInstitute"
            label="الجامعة / المعهد"
            required
            placeholder="اسم الجهة التعليمية"
          />

          <AppInput
            v-model="form.GraduationYear"
            label="سنة التخرج"
            type="number"
            required
            placeholder="مثال: 2023"
          />

          <AppInput
            v-model="form.GPA_or_Grade"
            label="المعدل / التقدير"
            required
            placeholder="مثال: 4.5 من 5 أو ممتاز"
          />

          <div class="flex items-end">
            <AppButton
              type="submit"
              class="w-full bg-surface-section hover:bg-surface-border text-primary border border-primary transition-colors py-2 rounded flex justify-center items-center"
              :disabled="qualificationStore.loading"
            >
              <svg
                v-if="!qualificationStore.loading"
                class="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              <span>{{ qualificationStore.loading ? 'جاري الإضافة...' : 'إضافة المؤهل' }}</span>
            </AppButton>
          </div>
        </div>
      </form>
    </div>

    <div class="mb-8">
      <h3 class="text-lg font-semibold text-text-primary mb-3">المؤهلات المضافة</h3>
      <AppTable
        :headers="tableHeaders"
        :items="qualificationStore.applicantQualifications"
        :isLoading="qualificationStore.loading"
        :rowClickable="false"
      >
        <template #cell-actions="{ item }">
          <button
            @click="deleteQualification(item.id)"
            class="text-danger hover:text-red-400 transition-colors p-1"
            title="حذف"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </template>
      </AppTable>
    </div>

    <div class="flex justify-between mt-8 pt-4 border-t border-surface-border">
      <AppButton
        type="button"
        @click="emit('go-back')"
        class="bg-surface-section hover:bg-surface-border text-text-primary px-6 py-2 rounded transition-colors"
      >
        السابق
      </AppButton>

      <AppButton
        type="button"
        @click="proceedToNext"
        class="bg-primary hover:bg-primary-dark text-white px-8 py-2 rounded transition-colors"
      >
        المتابعة
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useApplicantQualificationStore } from '@/stores/applicantQualificationStore' // تأكد من المسار
import AppInput from '@/components/ui/AppInput.vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppTable from '@/components/ui/AppTable.vue'

const props = defineProps({
  applicantId: {
    type: [Number, String],
    required: true,
  },
})

const emit = defineEmits(['step-completed', 'go-back'])
const qualificationStore = useApplicantQualificationStore()

// خيارات الدرجة العلمية للقائمة المنسدلة
const degreeOptions = ref([
  { label: 'ثانوية عامة', value: 'High School' },
  { label: 'دبلوم', value: 'Diploma' },
  { label: 'بكالوريوس', value: 'Bachelor' },
  { label: 'ماجستير', value: 'Master' },
  { label: 'دكتوراه', value: 'PhD' },
])

// إعداد أعمدة الجدول لمكون AppTable
const tableHeaders = [
  { key: 'DegreeLevel', label: 'الدرجة' },
  { key: 'Major', label: 'التخصص' },
  { key: 'UniversityOrInstitute', label: 'الجهة التعليمية' },
  { key: 'GraduationYear', label: 'سنة التخرج' },
  { key: 'GPA_or_Grade', label: 'المعدل' },
  { key: 'actions', label: 'إجراءات', class: 'w-16 text-center', cellClass: 'text-center' },
]

// حالة نموذج الإدخال
const form = reactive({
  DegreeLevel: '',
  Major: '',
  UniversityOrInstitute: '',
  GraduationYear: '',
  GPA_or_Grade: '',
})

// عند تحميل المكون، نجلب المؤهلات (في حال قام المستخدم بالرجوع لهذه الخطوة ليرى ما أضافه)
onMounted(() => {
  if (props.applicantId) {
    qualificationStore.fetchQualificationsByApplicant(props.applicantId)
  }
})

// دالة إضافة مؤهل جديد للـ Backend
const addQualification = async () => {
  try {
    const payload = {
      ...form,
      applicant_id: props.applicantId, // ربط المؤهل برقم المتقدم الذي أتى من الخطوة 1
    }
    await qualificationStore.createQualification(payload)

    // تفريغ الحقول بعد النجاح
    resetForm()

    // تحديث الجدول
    qualificationStore.fetchQualificationsByApplicant(props.applicantId)
  } catch (error) {
    console.error('فشل حفظ المؤهل', error)
  }
}

// دالة حذف مؤهل من الجدول
const deleteQualification = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذا المؤهل؟')) {
    try {
      await qualificationStore.deleteQualification(id)
      qualificationStore.fetchQualificationsByApplicant(props.applicantId)
    } catch (error) {
      console.error('فشل الحذف', error)
    }
  }
}

// تفريغ النموذج
const resetForm = () => {
  form.DegreeLevel = ''
  form.Major = ''
  form.UniversityOrInstitute = ''
  form.GraduationYear = ''
  form.GPA_or_Grade = ''
}

// الانتقال للخطوة التالية (الخبرات)
const proceedToNext = () => {
  // لا نحتاج لإرسال بيانات هنا، فقط نبلغ الأب بالانتقال
  emit('step-completed')
}
</script>
