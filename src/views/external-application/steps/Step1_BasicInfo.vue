<!--src\views\external-application\steps\Step1_BasicInfo.vue-->
<template>
  <div class="animate-fade-in space-y-10">
    <div
      class="flex flex-col md:flex-row items-center justify-between p-5 bg-gradient-to-r from-primary/5 to-transparent border-r-4 border-primary rounded-xl shadow-sm"
    >
      <div class="flex items-center gap-4 mb-4 md:mb-0">
        <div class="p-3 bg-white dark:bg-surface-section rounded-full shadow-sm text-primary">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h3 class="font-bold text-text-primary">هل لديك طلب سابق؟</h3>
          <p class="text-sm text-text-muted">أكمل من حيث توقفت باستخدام كود التتبع.</p>
        </div>
      </div>
      <AppButton
        @click="isResumeModalOpen = true"
        variant="outline"
        class="w-full md:w-auto !border-primary !text-primary hover:!bg-primary/5 font-bold"
      >
        استكمال التقديم
      </AppButton>
    </div>

    <div class="border-b border-surface-border pb-4">
      <h2 class="text-2xl font-black text-text-primary flex items-center gap-3">
        <span class="w-2 h-8 bg-primary rounded-full"></span>
        البيانات الشخصية
      </h2>
      <p class="text-text-muted mt-2 mr-5">يرجى إدخال البيانات الرسمية لضمان قبول الطلب.</p>
    </div>

    <div
      v-if="applicantStore.error"
      class="p-4 bg-danger/5 border border-danger/20 rounded-xl flex items-center gap-3 text-danger"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clip-rule="evenodd"
        />
      </svg>
      <p class="text-sm font-medium">{{ applicantStore.error }}</p>
    </div>

    <form @submit.prevent="submitForm" class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <AppInput
          id="first_name"
          v-model="form.FirstName"
          label="الاسم الأول"
          required
          placeholder="مثال: محمد"
          class="focus-within:ring-2 ring-primary/20 transition-all"
        />
        <AppInput
          id="last_name"
          v-model="form.LastName"
          label="اسم العائلة"
          required
          placeholder="مثال: القحطاني"
        />
        <AppInput
          id="national_id"
          v-model="form.NationalID"
          label="الرقم الوطني / الإقامة"
          type="number"
          required
          placeholder="10 أرقام تبدأ بـ 1 أو 2"
        />
        <AppInput
          id="email"
          v-model="form.Email"
          label="البريد الإلكتروني"
          type="email"
          required
          placeholder="name@example.com"
        />
        <AppInput
          id="phone"
          v-model="form.PhoneNumber"
          label="رقم الهاتف"
          type="tel"
          required
          placeholder="05xxxxxxxx"
          dir="ltr"
        />
        <CitiesDropdown id="city_id" v-model="form.city_id" label="المدينة" required />
      </div>

      <div class="flex justify-end pt-6">
        <AppButton
          type="submit"
          class="w-full md:w-64 !h-14 !text-lg shadow-xl shadow-primary/20 group"
          :disabled="applicantStore.loading"
        >
          <template v-if="applicantStore.loading"> جاري المعالجة... </template>
          <template v-else>
            <span class="flex items-center justify-center gap-2">
              حفظ والمتابعة
              <svg
                class="w-5 h-5 transition-transform group-hover:translate-x-[-5px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </span>
          </template>
        </AppButton>
      </div>
    </form>

    <ResumeApplicationModal
      :is-open="isResumeModalOpen"
      @close="isResumeModalOpen = false"
      @resumed="handleSuccessfulResume"
    />

    <transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
    >
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      >
        <div
          class="bg-surface-ground rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-zoom-in"
        >
          <div class="bg-primary p-8 text-center text-white relative">
            <div
              class="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white dark:bg-surface-ground rounded-full flex items-center justify-center shadow-lg text-primary"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 class="text-2xl font-black mb-1">تم الحفظ بنجاح!</h3>
            <p class="opacity-80 text-sm">تم إنشاء ملفك الشخصي الأولي</p>
          </div>

          <div class="p-8 pt-12 text-center">
            <p class="text-text-secondary mb-6 leading-relaxed">
              يرجى حفظ <b>كود التتبع</b> الخاص بك للعودة للطلب لاحقاً:
            </p>

            <div
              class="bg-surface-section border-2 border-dashed border-primary/30 rounded-2xl p-6 mb-8 relative group"
            >
              <span
                class="absolute -top-3 right-6 bg-surface-ground px-2 text-xs text-primary font-bold italic"
                >SECRET CODE</span
              >
              <p
                class="text-4xl font-mono font-black text-primary tracking-[0.2em] select-all cursor-pointer"
              >
                {{ applicantStore.trackingCode }}
              </p>
            </div>

            <AppButton
              @click="proceedToNextStep"
              class="w-full !h-14 !rounded-2xl shadow-lg shadow-primary/30 font-bold"
            >
              متابعة لرفع المرفقات
            </AppButton>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useApplicantStore } from '@/stores/ApplicantStore'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import CitiesDropdown from '@/components/forms/CitiesDropdown.vue'
import ResumeApplicationModal from '@/views/external-application/steps/ResumeApplicationModal.vue'

const emit = defineEmits(['step-completed'])
const applicantStore = useApplicantStore()

const showSuccessModal = ref(false)
const savedApplicantId = ref(null)
const isResumeModalOpen = ref(false)

const form = reactive({
  FirstName: '',
  LastName: '',
  NationalID: '',
  Email: '',
  PhoneNumber: '',
  city_id: null,
  ApplicationSource: 'Online',
})

const submitForm = async () => {
  try {
    const payload = { ...form, city_id: form.city_id ? Number(form.city_id) : null }
    const newApplicant = await applicantStore.createApplicant(payload)
    savedApplicantId.value = newApplicant.id
    showSuccessModal.value = true
  } catch (error) {
    console.error('Submission failed:', error)
  }
}

const proceedToNextStep = () => {
  showSuccessModal.value = false
  emit('step-completed', { applicantId: savedApplicantId.value })
}

const handleSuccessfulResume = (applicantData) => {
  emit('step-completed', { applicantId: applicantData.id })
}
</script>

<style scoped>
@keyframes zoom-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-zoom-in {
  animation: zoom-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
