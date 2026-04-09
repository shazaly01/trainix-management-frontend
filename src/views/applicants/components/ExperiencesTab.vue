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
        لا يمكنك إضافة خبرات مهنية قبل حفظ الملف الأساسي للمتقدم لإنشاء رقم مرجعي له.
      </p>
    </div>

    <div v-else>
      <div class="mb-6 border-b border-surface-border pb-4">
        <h3 class="text-lg font-bold text-text-primary">الخبرات المهنية</h3>
        <p class="text-sm text-text-muted mt-1">
          إضافة وإدارة السجل الوظيفي والخبرات السابقة للمتقدم.
        </p>
      </div>

      <div
        v-if="experienceStore.error"
        class="mb-4 p-3 bg-danger/10 border-l-4 border-danger rounded text-danger text-sm"
      >
        {{ experienceStore.error }}
      </div>

      <form
        @submit.prevent="addExperience"
        class="bg-surface-section p-5 rounded-lg border border-surface-border mb-8"
      >
        <h4 class="text-md font-semibold text-primary mb-4">إضافة خبرة جديدة</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInput
            id="job_title"
            v-model="form.JobTitle"
            label="المسمى الوظيفي"
            required
            placeholder="مثال: مهندس برمجيات"
          />
          <AppInput
            id="company"
            v-model="form.Company"
            label="اسم الشركة / الجهة"
            required
            placeholder="اسم جهة العمل السابقة"
          />
          <AppInput
            id="start_date"
            v-model="form.StartDate"
            label="تاريخ البداية"
            type="date"
            required
          />
          <AppInput
            id="end_date"
            v-model="form.EndDate"
            label="تاريخ النهاية"
            type="date"
            placeholder="اتركه فارغاً إذا كان لا يزال يعمل بها"
          />

          <div class="md:col-span-2 flex justify-end mt-2">
            <AppButton
              type="submit"
              class="bg-primary hover:bg-primary-dark text-white px-8 py-2 rounded transition-colors"
              :disabled="experienceStore.loading"
            >
              {{ experienceStore.loading ? 'جاري الإضافة...' : 'إضافة الخبرة' }}
            </AppButton>
          </div>
        </div>
      </form>

      <div>
        <h4 class="text-md font-semibold text-text-primary mb-3">الخبرات المسجلة</h4>
        <AppTable
          :headers="tableHeaders"
          :items="experienceStore.applicantExperiences || []"
          :isLoading="experienceStore.loading"
          :rowClickable="false"
        >
          <template #cell-EndDate="{ item }">
            <span :class="!item.EndDate ? 'text-green-600 font-bold' : ''">
              {{ item.EndDate ? item.EndDate : 'حتى الآن' }}
            </span>
          </template>

          <template #cell-actions="{ item }">
            <button
              @click="deleteExperience(item.id)"
              class="text-danger hover:bg-danger/10 p-2 rounded transition-colors"
              title="حذف الخبرة"
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
// تأكد من وجود الستور الخاص بالخبرات لديك
import { useApplicantExperienceStore } from '@/stores/applicantExperienceStore'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppTable from '@/components/ui/AppTable.vue'

const props = defineProps({
  applicantId: { type: [Number, String], default: null },
})

const experienceStore = useApplicantExperienceStore()

const tableHeaders = [
  { key: 'JobTitle', label: 'المسمى الوظيفي' },
  { key: 'CompanyName', label: 'الشركة / الجهة' }, // ✅ تم التعديل من Company لـ CompanyName
  { key: 'StartDate', label: 'تاريخ البداية', class: 'text-center' },
  { key: 'EndDate', label: 'تاريخ النهاية', class: 'text-center' },
  { key: 'actions', label: 'إجراءات', class: 'w-16 text-center' },
]

const form = reactive({
  JobTitle: '',
  Company: '',
  StartDate: '',
  EndDate: '',
})

// جلب بيانات الخبرات عند توفر الـ ID
const loadExperiences = () => {
  if (props.applicantId) {
    // افترضنا وجود الدالة في experienceStore لجلب خبرات متقدم معين
    experienceStore.fetchExperiencesByApplicant(props.applicantId)
  }
}

onMounted(loadExperiences)

watch(
  () => props.applicantId,
  (newId) => {
    if (newId) loadExperiences()
  },
)

const addExperience = async () => {
  if (!props.applicantId) return

  try {
    const payload = {
      applicant_id: props.applicantId,
      JobTitle: form.JobTitle,
      CompanyName: form.Company, // ✅ نأخذ القيمة من الـ form ونسميها CompanyName للباك-أند
      StartDate: form.StartDate,
      EndDate: form.EndDate || null,
      JobDescription: form.JobDescription || '', // أضفناه لأنه موجود في الـ Request
    }

    await experienceStore.createExperience(payload)

    // تفريغ النموذج
    form.JobTitle = ''
    form.Company = ''
    form.StartDate = ''
    form.EndDate = ''

    // إعادة الجلب (تأكد من اسم الدالة في الستور الخاص بك)
    await experienceStore.fetchExperiencesByApplicant(props.applicantId)
  } catch (error) {
    console.error('فشل إضافة الخبرة:', error)
  }
}

const deleteExperience = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذه الخبرة؟')) {
    try {
      await experienceStore.deleteExperience(id)
      loadExperiences()
    } catch (error) {
      console.error('فشل حذف الخبرة:', error)
    }
  }
}
</script>
