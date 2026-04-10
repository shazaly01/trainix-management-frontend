<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div
      class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      @click="$emit('close')"
    ></div>

    <div
      class="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100"
    >
      <button
        @click="$emit('close')"
        class="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12" stroke-width="2.5" stroke-linecap="round" />
        </svg>
      </button>

      <div class="text-center mb-8">
        <div
          class="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner text-3xl transform rotate-3"
        >
          🔓
        </div>
        <h3 class="text-2xl font-black text-slate-900 tracking-tight">تعديل طلب سابق</h3>
        <p class="text-slate-500 mt-2 text-sm">أدخل بياناتك للتحقق من هويتك واسترجاع ملفك</p>
      </div>

      <div
        v-if="error"
        class="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top-2"
      >
        <span class="text-xl">⚠️</span>
        <span>{{ error }}</span>
      </div>

      <form @submit.prevent="handleVerify" class="space-y-6">
        <div class="flex p-1.5 bg-slate-50/80 rounded-2xl mb-2 border border-slate-100">
          <button
            type="button"
            @click="idType = 'national'"
            :class="
              idType === 'national'
                ? 'bg-white shadow-sm text-blue-600 font-black'
                : 'text-slate-400 font-bold hover:text-slate-600'
            "
            class="flex-1 py-3 rounded-xl text-xs transition-all"
          >
            الرقم الوطني
          </button>
          <button
            type="button"
            @click="idType = 'passport'"
            :class="
              idType === 'passport'
                ? 'bg-white shadow-sm text-blue-600 font-black'
                : 'text-slate-400 font-bold hover:text-slate-600'
            "
            class="flex-1 py-3 rounded-xl text-xs transition-all"
          >
            رقم الجواز
          </button>
        </div>

        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
              {{ idType === 'national' ? 'الرقم الوطني' : 'رقم الجواز' }}
            </label>
            <input
              v-model="form.id_number"
              required
              type="text"
              :placeholder="idType === 'national' ? 'أدخل الرقم الوطني...' : 'أدخل رقم الجواز...'"
              class="v-input uppercase"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2"
              >كود التحقق</label
            >
            <input
              v-model="form.verification_code"
              required
              type="text"
              maxlength="6"
              placeholder="000000"
              class="v-input text-center tracking-[0.4em] font-black font-mono text-xl text-blue-600"
            />
          </div>
        </div>

        <button
          :disabled="loading"
          type="submit"
          class="w-full h-16 mt-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:bg-slate-300 flex items-center justify-center gap-3 group"
        >
          <span
            v-if="loading"
            class="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"
          ></span>
          <span v-else>تحقق واسترجاع البيانات</span>
          <svg
            v-if="!loading"
            class="w-5 h-5 group-hover:translate-x-[-5px] transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import CandidateService from '@/services/CandidateService'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'verified'])

// حالة المكون
const idType = ref('national') // 'national' | 'passport'
const loading = ref(false)
const error = ref(null)

const form = reactive({
  id_number: '',
  verification_code: '',
})

// تصفير النموذج والخطأ عند إغلاق أو فتح النافذة
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      error.value = null
      form.id_number = ''
      form.verification_code = ''
      idType.value = 'national'
    }
  },
)

// دالة التحقق واسترجاع البيانات
const handleVerify = async () => {
  // التأكد من إدخال البيانات الأساسية قبل الإرسال
  if (!form.id_number || !form.verification_code) return

  loading.value = true
  error.value = null

  // تجهيز الـ Payload (البيانات المرسلة) بناءً على نوع الهوية المختارة
  const payload = {
    verification_code: form.verification_code,
  }

  if (idType.value === 'national') {
    payload.national_no = form.id_number
  } else {
    payload.passport_no = form.id_number
  }

  try {
    // استدعاء دالة التحقق من ملف الخدمة بدلاً من axios مباشرة
    const response = await CandidateService.verifyPublic(payload)

    // إرسال البيانات المسترجعة للمكون الأب (الفورم الرئيسي) لملء الحقول
    emit('verified', response.data.data)
  } catch (err) {
    // التقاط الخطأ وعرضه بشكل واضح للمستخدم
    error.value = err.response?.data?.message || 'عذراً، البيانات المدخلة غير صحيحة أو غير متطابقة.'
    console.error('Verify Error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-input {
  @apply w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300 placeholder:tracking-normal;
}
</style>
