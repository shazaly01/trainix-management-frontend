<template>
  <div
    class="relative w-full max-w-5xl mx-auto min-h-screen md:min-h-[600px] flex flex-col bg-slate-300 rounded-none md:rounded-[3rem] shadow-none md:shadow-2xl border-none md:border border-slate-400 overflow-hidden p-0 md:p-12 animate-in slide-in-from-bottom-4 duration-500"
  >
    <div
      class="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0 pointer-events-none opacity-40"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="w-full h-auto">
        <path
          fill="#e0e7ff"
          fill-opacity="1"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>

    <div
      v-if="submitted"
      class="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-700"
    >
      <div
        class="w-28 h-28 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-inner shadow-emerald-300"
      >
        <svg class="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 class="text-3xl font-black text-slate-900 mb-3">تم استلام طلبك بنجاح!</h2>
      <p class="text-slate-600 mb-10 max-w-md mx-auto text-lg">
        أهلاً بك يا <span class="text-blue-700 font-black">{{ form.Name.split(' ')[0] }}</span
        >، لقد تم حفظ بياناتك بنجاح.
      </p>
      <div
        class="group bg-blue-50 border-2 border-dashed border-blue-400 rounded-3xl p-8 min-w-[300px] shadow-sm"
      >
        <p class="text-xs text-blue-600 font-black mb-3">رقم التحقق السري</p>
        <div class="text-5xl font-black text-blue-900 tracking-[0.15em] font-mono">
          {{ verificationCode }}
        </div>
      </div>
      <button
        @click="resetForm"
        class="mt-12 px-10 py-4 bg-blue-700 text-white rounded-2xl font-black shadow-xl"
      >
        العودة للرئيسية
      </button>
    </div>

    <div v-else class="relative z-10 p-6 md:p-0">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b-2 border-slate-400/20 pb-8"
      >
        <div>
          <h2 class="text-3xl font-black text-blue-900 mb-2">نموذج التقديم الإلكتروني</h2>
          <p class="text-sm font-bold text-slate-600">
            يرجى تعبئة الحقول المطلوبة لتأكيد تسجيلك في الدورة
          </p>
        </div>
        <button
          type="button"
          @click="showVerifyModal = true"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black shadow-md transition-all hover:bg-blue-700"
        >
          تعديل طلب سابق
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-10">
        <div class="flex flex-col items-center gap-4">
          <div class="relative group cursor-pointer">
            <div
              class="w-32 h-32 rounded-[2rem] bg-slate-100 border-2 border-dashed border-blue-400 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-600 group-hover:bg-blue-50"
            >
              <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />
              <div v-else class="text-blue-500 flex flex-col items-center">
                <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" />
                  <path
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    stroke-width="2"
                  />
                </svg>
                <span class="text-[10px] font-black uppercase">أرفق صورة</span>
              </div>
            </div>
            <input
              type="file"
              @change="handleImageChange"
              class="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div class="space-y-2">
            <label class="public-label"
              >الاسم رباعي بالكامل <span class="text-red-500">*</span></label
            >
            <input
              v-model="form.Name"
              required
              type="text"
              placeholder="مثال: محمد أحمد عبدالله..."
              class="public-input"
            />
          </div>

          <div class="space-y-2">
            <label class="public-label">نوع التدريب <span class="text-red-500">*</span></label>
            <select
              v-model="form.TrainingType"
              required
              class="public-input appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%20stroke%3D%22%2364748b%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_1.25rem_center] bg-no-repeat"
            >
              <option value="internal">تدريب داخلي</option>
              <option value="external">تدريب خارجي</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="public-label">الرقم الوطني <span class="text-red-500">*</span></label>
            <input
              v-model="form.NationalNo"
              required
              type="text"
              placeholder="أدخل رقم الهوية..."
              class="public-input"
            />
          </div>

          <div class="space-y-2">
            <label class="public-label flex justify-between">
              <span>تاريخ الميلاد <span class="text-red-500">*</span></span>
              <span v-if="age" class="text-white font-bold bg-blue-600 px-2 py-0.5 rounded text-xs"
                >العمر: {{ age }} سنة</span
              >
            </label>
            <input v-model="form.BirthDate" required type="date" class="public-input" />
          </div>

          <div class="space-y-2">
            <label class="public-label"
              >رقم الهاتف (واتساب) <span class="text-red-500">*</span></label
            >
            <input
              v-model="form.Phone"
              required
              type="text"
              placeholder="09xxxxxxx"
              class="public-input font-mono"
              dir="ltr"
            />
          </div>

          <div class="space-y-2">
            <label class="public-label"
              >المؤهل العلمي / التخصص <span class="text-red-500">*</span></label
            >
            <input
              v-model="form.Qualification"
              required
              type="text"
              placeholder="مثال: بكالوريوس هندسة..."
              class="public-input"
            />
          </div>

          <div class="space-y-2">
            <label class="public-label">المدينة / السكن <span class="text-red-500">*</span></label>
            <input
              v-model="form.Residence"
              required
              type="text"
              placeholder="المدينة - الحي..."
              class="public-input"
            />
          </div>

          <div class="space-y-2">
            <label class="public-label">رقم الجواز (اختياري)</label>
            <input
              v-model="form.PassportNo"
              type="text"
              placeholder="A1234567"
              class="public-input uppercase"
            />
          </div>

          <div class="space-y-2">
            <label class="public-label">تاريخ انتهاء الجواز (اختياري)</label>
            <input v-model="form.PassportExpiry" type="date" class="public-input" />
          </div>

          <div class="space-y-3 md:col-span-2 mt-4">
            <label class="public-label"
              >مقاس الزي الموحد (Uniform Size) <span class="text-red-500">*</span></label
            >
            <div class="flex flex-wrap gap-2 md:gap-4 justify-center md:justify-start">
              <button
                v-for="s in ['S', 'M', 'L', 'XL', '2XL', '3XL']"
                :key="s"
                type="button"
                @click="form.Size = s"
                :class="
                  form.Size === s
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-300 border-blue-600 scale-105'
                    : 'bg-white/50 text-slate-700 border-slate-300'
                "
                class="w-14 h-14 md:w-16 md:h-16 rounded-xl font-black transition-all border-2 flex items-center justify-center text-lg"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <div class="space-y-2 md:col-span-2">
            <label class="public-label">ملاحظات إضافية (اختياري)</label>
            <textarea
              v-model="form.Notes"
              placeholder="أضف أي معلومات إضافية..."
              class="public-input h-28 py-4 resize-none"
            ></textarea>
          </div>
        </div>

        <div class="pt-6">
          <button
            type="submit"
            :disabled="loading"
            class="w-full h-16 bg-blue-700 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-blue-800 disabled:bg-slate-400 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <span
              v-if="loading"
              class="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"
            ></span>
            <span v-else>{{ isUpdating ? 'حفظ التعديلات' : 'تأكيد إرسال الطلب' }}</span>
          </button>
        </div>
      </form>
    </div>

    <PublicCandidateVerify
      :is-open="showVerifyModal"
      @close="showVerifyModal = false"
      @verified="handleDataResumed"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CandidateService from '@/services/CandidateService'
import PublicCandidateVerify from './PublicCandidateVerify.vue'

const props = defineProps({
  jobRequestId: { type: [Number, String], required: true },
})

const loading = ref(false)
const submitted = ref(false)
const isUpdating = ref(false)
const verificationCode = ref('')
const imagePreview = ref(null)
const showVerifyModal = ref(false)

const form = ref({
  job_request_id: props.jobRequestId,
  TrainingType: 'internal', // الحقل الجديد
  Name: '',
  NationalNo: '',
  BirthDate: '',
  Phone: '',
  Qualification: '',
  Residence: '',
  PassportNo: '',
  PassportExpiry: '',
  Size: 'L',
  Notes: '',
  image: null,
  verification_code: '',
})

const age = computed(() => {
  if (!form.value.BirthDate) return null
  const birth = new Date(form.value.BirthDate)
  const today = new Date()
  let a = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--
  return a
})

const handleImageChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.image = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const handleDataResumed = (data) => {
  isUpdating.value = true
  showVerifyModal.value = false
  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    return dateString.split('T')[0].split(' ')[0]
  }
  form.value = {
    ...form.value,
    ...data,
    TrainingType: data.TrainingType || 'internal', // استرجاع نوع التدريب عند التعديل
    BirthDate: formatDateForInput(data.BirthDate),
    PassportExpiry: formatDateForInput(data.PassportExpiry),
    verification_code: data.VerificationCode || data.verification_code,
  }
  imagePreview.value = data.image_url || (data.image ? data.image.file_path : null)
  window.scrollTo({ top: 400, behavior: 'smooth' })
}

const handleSubmit = async () => {
  loading.value = true
  const formData = new FormData()
  Object.keys(form.value).forEach((key) => {
    if (form.value[key] !== null && form.value[key] !== undefined && form.value[key] !== '') {
      if (key === 'image' && !(form.value[key] instanceof File)) return
      formData.append(key, form.value[key])
    }
  })
  try {
    let response = isUpdating.value
      ? await CandidateService.updatePublic(formData)
      : await CandidateService.submitPublic(formData)
    verificationCode.value =
      response.data.data.verification_code ||
      response.data.data.VerificationCode ||
      form.value.verification_code
    submitted.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    alert(err.response?.data?.message || 'فشل إرسال الطلب، يرجى التأكد من البيانات.')
  } finally {
    loading.value = false
  }
}

const resetForm = () => window.location.reload()
</script>

<style scoped>
.public-label {
  @apply text-sm font-black text-slate-800 mb-1 ml-1 block;
}

.public-input {
  /* جعل الخلفية شفافة قليلاً لتندمج مع الرمادي وتختفي الحواف البيضاء */
  @apply w-full h-14 px-5 bg-white/70 border-2 border-slate-400/20 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-bold text-slate-900 outline-none;
}
</style>
