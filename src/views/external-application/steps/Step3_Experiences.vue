<template>
  <div class="animate-fade-in">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-text-primary">الخبرات المهنية</h2>
      <p class="text-sm text-text-muted mt-1">أضف خبراتك العملية السابقة، وابدأ بالوظيفة الأحدث.</p>
    </div>

    <div
      v-if="experienceStore.error"
      class="mb-4 p-3 bg-danger/10 border-l-4 border-danger rounded text-danger text-sm"
    >
      {{ experienceStore.error }}
    </div>

    <div class="bg-surface-ground border border-surface-border rounded-lg p-5 mb-8">
      <form @submit.prevent="addExperience">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInput
            v-model="form.JobTitle"
            label="المسمى الوظيفي"
            required
            placeholder="مثال: مطور واجهات أمامية"
          />

          <AppInput
            v-model="form.CompanyName"
            label="اسم الشركة / الجهة"
            required
            placeholder="مثال: شركة التقنية الحديثة"
          />

          <AppInput v-model="form.StartDate" label="تاريخ البداية" type="date" required />

          <AppInput
            v-model="form.EndDate"
            label="تاريخ النهاية"
            type="date"
            placeholder="اتركه فارغاً إذا كنت لا تزال تعمل هنا"
          />

          <div class="md:col-span-2">
            <AppTextarea
              v-model="form.JobDescription"
              label="الوصف الوظيفي (اختياري)"
              rows="3"
              placeholder="صف باختصار مهامك وإنجازاتك في هذا المنصب..."
            />
          </div>

          <div class="md:col-span-2 flex justify-end mt-2">
            <AppButton
              type="submit"
              class="bg-surface-section hover:bg-surface-border text-primary border border-primary transition-colors py-2 px-6 rounded flex items-center"
              :disabled="experienceStore.loading"
            >
              <svg
                v-if="!experienceStore.loading"
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
              <span>{{ experienceStore.loading ? 'جاري الإضافة...' : 'إضافة الخبرة' }}</span>
            </AppButton>
          </div>
        </div>
      </form>
    </div>

    <div class="mb-8">
      <h3 class="text-lg font-semibold text-text-primary mb-3">الخبرات المضافة</h3>
      <AppTable
        :headers="tableHeaders"
        :items="experienceStore.applicantExperiences"
        :isLoading="experienceStore.loading"
        :rowClickable="false"
      >
        <template #cell-actions="{ item }">
          <button
            @click="deleteExperience(item.id)"
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
        @click="emit('step-completed')"
        class="bg-primary hover:bg-primary-dark text-white px-8 py-2 rounded transition-colors"
      >
        المتابعة
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useApplicantExperienceStore } from '@/stores/applicantExperienceStore'
import AppInput from '@/components/ui/AppInput.vue'
// قم بتأكيد استيراد AppTextarea أو استخدم <textarea> العادي إذا لم يكن جاهزاً تماماً
import AppTextarea from '@/components/ui//AppTextarea.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppTable from '@/components/ui/AppTable.vue'

const props = defineProps({
  applicantId: { type: [Number, String], required: true },
})

const emit = defineEmits(['step-completed', 'go-back'])
const experienceStore = useApplicantExperienceStore()

const tableHeaders = [
  { key: 'JobTitle', label: 'المسمى الوظيفي' },
  { key: 'CompanyName', label: 'الشركة' },
  { key: 'StartDate', label: 'من' },
  { key: 'EndDate', label: 'إلى' },
  { key: 'actions', label: 'إجراءات', class: 'w-16 text-center', cellClass: 'text-center' },
]

const form = reactive({
  JobTitle: '',
  CompanyName: '',
  StartDate: '',
  EndDate: '',
  JobDescription: '',
})

onMounted(() => {
  if (props.applicantId) {
    experienceStore.fetchExperiencesByApplicant(props.applicantId)
  }
})

const addExperience = async () => {
  try {
    const payload = { ...form, applicant_id: props.applicantId }
    await experienceStore.createExperience(payload)
    resetForm()
    experienceStore.fetchExperiencesByApplicant(props.applicantId)
  } catch (error) {
    console.error('فشل إضافة الخبرة', error)
  }
}

const deleteExperience = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذه الخبرة؟')) {
    try {
      await experienceStore.deleteExperience(id)
      experienceStore.fetchExperiencesByApplicant(props.applicantId)
    } catch (error) {
      console.error('فشل الحذف', error)
    }
  }
}

const resetForm = () => {
  form.JobTitle = ''
  form.CompanyName = ''
  form.StartDate = ''
  form.EndDate = ''
  form.JobDescription = ''
}
</script>
