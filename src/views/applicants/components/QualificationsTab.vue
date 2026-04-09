<template>
  <div class="animate-fade-in bg-surface-ground p-6 rounded-lg border border-surface-border">
    <div v-if="!applicantId" class="text-center py-10">
      <div
        class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 text-warning mb-4"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
      </div>
      <h3 class="text-lg font-bold text-text-primary">يرجى حفظ البيانات الأساسية أولاً</h3>
      <p class="text-sm text-text-muted mt-2">
        لا يمكنك إضافة مؤهلات علمية قبل حفظ الملف الأساسي للمتقدم لإنشاء رقم مرجعي له.
      </p>
    </div>

    <div v-else>
      <div class="mb-6 border-b border-surface-border pb-4 flex justify-between items-center">
        <div>
          <h3 class="text-lg font-bold text-text-primary">المؤهلات العلمية</h3>
          <p class="text-sm text-text-muted mt-1">إضافة وإدارة الشهادات الأكاديمية للمتقدم.</p>
        </div>
      </div>

      <div
        v-if="qualificationStore.error"
        class="mb-4 p-3 bg-danger/10 border-l-4 border-danger rounded text-danger text-sm"
      >
        {{ qualificationStore.error }}
      </div>

      <form
        @submit.prevent="addQualification"
        class="bg-surface-section p-5 rounded-lg border border-surface-border mb-8"
      >
        <h4 class="text-md font-semibold text-primary mb-4">إضافة مؤهل جديد</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AppDropdown
            id="degree"
            v-model="form.Degree"
            label="الدرجة العلمية"
            :options="degreeOptions"
            optionLabel="label"
            optionValue="value"
            required
          />
          <AppInput
            id="major"
            v-model="form.Major"
            label="التخصص"
            required
            placeholder="مثال: هندسة برمجيات"
          />
          <AppInput
            id="institution"
            v-model="form.Institution"
            label="الجهة التعليمية"
            required
            placeholder="اسم الجامعة أو المعهد"
          />
          <AppInput
            id="graduation_date"
            v-model="form.GraduationDate"
            label="سنة التخرج"
            type="number"
            required
            placeholder="مثال: 2023"
          />
          <AppInput
            id="gpa"
            v-model="form.GPA"
            label="المعدل / التقدير"
            placeholder="مثال: 3.5 أو ممتاز"
          />

          <div class="flex items-end">
            <AppButton
              type="submit"
              class="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded transition-colors"
              :disabled="qualificationStore.loading"
            >
              {{ qualificationStore.loading ? 'جاري الإضافة...' : 'إضافة المؤهل' }}
            </AppButton>
          </div>
        </div>
      </form>

      <div>
        <h4 class="text-md font-semibold text-text-primary mb-3">المؤهلات المسجلة</h4>
        <AppTable
          :headers="tableHeaders"
          :items="qualificationStore.applicantQualifications || []"
          :isLoading="qualificationStore.loading"
          :rowClickable="false"
        >
          <template #cell-actions="{ item }">
            <button
              @click="deleteQualification(item.id)"
              class="text-danger hover:bg-danger/10 p-2 rounded transition-colors"
              title="حذف المؤهل"
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
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'
// تأكد من وجود الستور الخاص بالمؤهلات (كما فعلنا في التقديم الخارجي)
import { useApplicantQualificationStore } from '@/stores/applicantQualificationStore'
import AppInput from '@/components/ui/AppInput.vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppTable from '@/components/ui/AppTable.vue'

const props = defineProps({
  applicantId: { type: [Number, String], default: null },
})

const qualificationStore = useApplicantQualificationStore()

const degreeOptions = [
  { label: 'ثانوية عامة', value: 'High School' },
  { label: 'دبلوم', value: 'Diploma' },
  { label: 'بكالوريوس', value: 'Bachelor' },
  { label: 'ماجستير', value: 'Master' },
  { label: 'دكتوراه', value: 'PhD' },
]

const tableHeaders = [
  // تأكد أن الكلمة هنا تطابق تماماً ما يرسله لارافل في الـ API
  { key: 'DegreeLevel', label: 'الدرجة' },
  { key: 'Major', label: 'التخصص' },
  { key: 'UniversityOrInstitute', label: 'الجهة التعليمية' }, // ✅ تم التعديل
  { key: 'GraduationYear', label: 'سنة التخرج', class: 'text-center', cellClass: 'text-center' }, // ✅ تم التعديل
  { key: 'actions', label: 'إجراءات', class: 'w-16 text-center', cellClass: 'text-center' },
]

const form = reactive({
  Degree: '',
  Major: '',
  Institution: '',
  GraduationDate: '',
  GPA: '',
})

// جلب بيانات المؤهلات عند توفر الـ ID
const loadQualifications = () => {
  if (props.applicantId) {
    // افترضنا وجود هذه الدالة في qualificationStore لجلب مؤهلات متقدم معين
    qualificationStore.fetchQualificationsByApplicant(props.applicantId)
  }
}

onMounted(loadQualifications)

// مراقبة الـ applicantId في حال تم إنشاء المتقدم للتو وتغيرت القيمة من null إلى رقم
watch(
  () => props.applicantId,
  (newId) => {
    if (newId) loadQualifications()
  },
)

const addQualification = async () => {
  if (!props.applicantId) return

  try {
    // ✅ نقوم ببناء الكائن بالأسماء التي يتوقعها لارافل بدقة
    const payload = {
      applicant_id: props.applicantId,
      DegreeLevel: form.Degree, // تحويل من Degree إلى DegreeLevel
      Major: form.Major, // يبقى كما هو
      GraduationYear: form.GraduationDate, // تحويل من GraduationDate إلى GraduationYear
      UniversityOrInstitute: form.Institution, // تحويل من Institution إلى UniversityOrInstitute
      GPA_or_Grade: form.GPA, // تحويل من GPA إلى GPA_or_Grade
    }

    // إرسال البيانات الصحيحة
    await qualificationStore.createQualification(payload)

    // تفريغ النموذج (Reset)
    form.Degree = ''
    form.Major = ''
    form.Institution = ''
    form.GraduationDate = ''
    form.GPA = ''

    loadQualifications()
  } catch (error) {
    console.error('فشل إضافة المؤهل:', error)
  }
}

const deleteQualification = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذا المؤهل؟')) {
    try {
      await qualificationStore.deleteQualification(id)
      loadQualifications()
    } catch (error) {
      console.error('فشل حذف المؤهل:', error)
    }
  }
}
</script>
