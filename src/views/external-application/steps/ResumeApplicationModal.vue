<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
  >
    <div
      class="bg-surface-ground rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in border border-surface-border relative"
    >
      <button
        @click="$emit('close')"
        class="absolute top-4 left-4 text-text-muted hover:text-danger transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>

      <div class="text-center mb-6">
        <div
          class="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            ></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-text-primary">استكمال طلب سابق</h3>
        <p class="text-sm text-text-muted mt-2">أدخل الرقم الوطني وكود التتبع للعودة لملفك.</p>
      </div>

      <div
        v-if="applicantStore.error"
        class="mb-4 p-3 bg-danger/10 border-l-4 border-danger rounded text-danger text-sm text-center"
      >
        {{ applicantStore.error }}
      </div>

      <form @submit.prevent="handleResume" class="space-y-5">
        <AppInput
          id="resume_national_id"
          v-model="form.NationalID"
          label="الرقم الوطني / الإقامة"
          type="number"
          required
          placeholder="أدخل رقم الهوية..."
        />

        <AppInput
          id="resume_tracking_code"
          v-model="form.tracking_code"
          label="كود التتبع السري"
          required
          placeholder="مثال: APP-X7B9"
          class="font-mono"
        />

        <AppButton
          type="submit"
          class="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl transition-colors mt-2"
          :disabled="applicantStore.loading"
        >
          {{ applicantStore.loading ? 'جاري التحقق...' : 'دخول للملف' }}
        </AppButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useApplicantStore } from '@/stores/ApplicantStore'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

defineProps({
  isOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'resumed'])
const applicantStore = useApplicantStore()

const form = reactive({
  NationalID: '',
  tracking_code: '',
})

const handleResume = async () => {
  try {
    // استدعاء دالة الاسترجاع من الستور
    const applicantData = await applicantStore.resumeApplication(form)

    // إغلاق النافذة المنبثقة وإرسال البيانات للويزارد لكي يقفز للخطوة الصحيحة
    emit('resumed', applicantData)
    emit('close')

    // تنظيف النموذج
    form.NationalID = ''
    form.tracking_code = ''
  } catch (error) {
    console.error('فشل الدخول:', error)
  }
}
</script>
