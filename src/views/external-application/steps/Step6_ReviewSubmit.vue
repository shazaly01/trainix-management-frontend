<template>
  <div class="animate-fade-in">
    <div v-if="!isSubmitted">
      <div class="mb-8 text-center">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-4"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            ></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-text-primary">اكتمل ملفك الشخصي بنجاح!</h2>
        <p class="text-text-muted mt-2">
          لقد قمت بإدخال بياناتك، مؤهلاتك، خبراتك، ومرفقاتك بنجاح. خطوة واحدة تفصلك عن التقديم.
        </p>
      </div>

      <div
        v-if="error"
        class="mb-4 p-3 bg-danger/10 border-l-4 border-danger rounded text-danger text-sm"
      >
        {{ error }}
      </div>

      <div
        class="bg-surface-ground border border-surface-border rounded-lg p-6 mb-8 max-w-2xl mx-auto"
      >
        <form @submit.prevent="submitFinalApplication">
          <div
            v-if="props.fixedJobRequestId"
            class="text-center p-4 bg-primary/5 rounded border border-primary/20 mb-6"
          >
            <p class="text-text-muted text-sm mb-1">أنت تتقدم لوظيفة:</p>
            <h3 class="text-xl font-bold text-primary">{{ props.fixedJobTitle }}</h3>
          </div>

          <div v-else>
            <h3 class="text-lg font-semibold text-text-primary mb-4 text-center">
              حدد الوظيفة المطلوبة
            </h3>
            <AppDropdown
              v-model="jobRequestId"
              label="الشاغر الوظيفي"
              :options="availableJobs"
              optionLabel="title"
              optionValue="id"
              required
              placeholder="اختر الوظيفة التي ترغب بالتقديم عليها"
            />
          </div>

          <div class="mt-6 flex justify-between pt-4 border-t border-surface-border">
            <AppButton
              type="button"
              @click="emit('go-back')"
              class="bg-surface-section hover:bg-surface-border text-text-primary px-6 py-2 rounded transition-colors"
            >
              مراجعة بياناتي
            </AppButton>

            <AppButton
              type="submit"
              class="bg-success hover:bg-green-600 text-white px-8 py-2 rounded transition-colors flex items-center shadow-lg shadow-success/30"
              :disabled="isLoading || !jobRequestId"
            >
              <svg
                v-if="isLoading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ isLoading ? 'جاري إرسال الطلب...' : 'تأكيد التقديم النهائي' }}</span>
            </AppButton>
          </div>
        </form>
      </div>
    </div>

    <div v-else class="text-center py-10 animate-fade-in">
      <div
        class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/10 text-success mb-6"
      >
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <h2 class="text-3xl font-bold text-text-primary mb-2">تم استلام طلبك بنجاح!</h2>
      <p class="text-text-muted mb-8 max-w-md mx-auto">
        تم إرسال طلب التوظيف الخاص بك إلى قسم الموارد البشرية. يرجى الاحتفاظ برقم الطلب أدناه
        للمراجعة والاستعلام مستقبلاً.
      </p>

      <div
        class="bg-surface-ground border border-surface-border rounded-xl p-6 inline-block shadow-lg"
      >
        <p class="text-sm text-text-muted mb-1">رقم الطلب (المرجع)</p>
        <p class="text-2xl font-mono font-bold tracking-widest text-primary dir-ltr">
          #{{ applicantStore.trackingCode }}
        </p>
      </div>

      <div class="mt-12">
        <AppButton
          @click="goToHome"
          class="bg-surface-section text-text-primary hover:bg-surface-border px-8 py-2 rounded"
        >
          العودة للرئيسية
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'
import AppButton from '@/components/ui/AppButton.vue'
import apiClient from '@/services/apiClient'
import { useApplicantStore } from '@/stores/ApplicantStore'

// ✅ إضافة الخصائص (props) الجديدة لاستقبال بيانات الوظيفة الثابتة
const props = defineProps({
  applicantId: { type: [Number, String], required: true },
  fixedJobRequestId: { type: [Number, String], default: null },
  fixedJobTitle: { type: String, default: '' },
})

const emit = defineEmits(['go-back'])

// ✅ إذا كان هناك ID ثابت قادم من الرابط، نعينه كقيمة افتراضية لـ jobRequestId
const jobRequestId = ref(props.fixedJobRequestId || '')
const isLoading = ref(false)
const isSubmitted = ref(false)
const transactionNo = ref('') // سيتم استقباله كـ String لضمان عدم ضياع أي أرقام من الـ DECIMAL
const error = ref('')
const applicantStore = useApplicantStore()

// قائمة افتراضية للتقديم العام
const availableJobs = ref([
  { id: 1, title: 'مطور واجهات أمامية (Vue.js) - قسم تقنية المعلومات' },
  { id: 2, title: 'مهندس برمجيات (Laravel) - قسم تقنية المعلومات' },
  { id: 3, title: 'مدير مشروع تقني - قسم إدارة المشاريع' },
])

const submitFinalApplication = async () => {
  if (!jobRequestId.value) return

  isLoading.value = true
  error.value = ''

  try {
    const response = await apiClient.post('/applications', {
      applicant_id: props.applicantId,
      job_request_id: jobRequestId.value,
    })

    transactionNo.value = response.data.data.TransactionNo
    isSubmitted.value = true
  } catch (err) {
    error.value = err.response?.data?.message || 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقاً.'
    console.error('فشل التقديم:', err)
  } finally {
    isLoading.value = false
  }
}

const goToHome = () => {
  window.location.reload()
}
</script>
