<template>
  <div class="animate-fade-in bg-surface-ground p-6 rounded-lg border border-surface-border">
    <div class="mb-6 border-b border-surface-border pb-4">
      <h3 class="text-lg font-bold text-text-primary">البيانات الشخصية</h3>
      <p class="text-sm text-text-muted mt-1">إدارة البيانات الأساسية للمتقدم (إدخال داخلي).</p>
    </div>

    <form @submit.prevent="saveData">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AppInput id="first_name" v-model="form.FirstName" label="الاسم الأول" required />
        <AppInput id="last_name" v-model="form.LastName" label="اسم العائلة" required />
        <AppInput
          id="national_id"
          v-model="form.NationalID"
          label="الرقم الوطني / الإقامة"
          type="number"
          required
        />
        <AppInput id="email" v-model="form.Email" label="البريد الإلكتروني" type="email" required />
        <AppInput
          id="phone"
          v-model="form.PhoneNumber"
          label="رقم الهاتف"
          type="tel"
          required
          dir="ltr"
        />
        <CitiesDropdown id="city_id" v-model="form.city_id" label="مدينة الإقامة" required />
      </div>

      <div class="mt-8 flex justify-end">
        <AppButton
          type="submit"
          class="bg-primary hover:bg-primary-dark text-white px-8 py-2.5 rounded transition-colors shadow-lg"
          :disabled="applicantStore.loading"
        >
          <span v-if="applicantStore.loading">جاري الحفظ...</span>
          <span v-else class="flex items-center">
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            {{ form.id ? 'تحديث البيانات' : 'حفظ المتقدم الجديد' }}
          </span>
        </AppButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import { useApplicantStore } from '@/stores/ApplicantStore'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import CitiesDropdown from '@/components/forms/CitiesDropdown.vue'

// نستقبل بيانات المتقدم من الشاشة الأب (إذا كنا في وضع التعديل)
const props = defineProps({
  applicantData: { type: Object, default: () => null },
})

// نرسل الـ ID للشاشة الأب بعد الحفظ لكي تفتح باقي التبويبات
const emit = defineEmits(['saved'])
const applicantStore = useApplicantStore()

const form = reactive({
  id: null,
  FirstName: '',
  LastName: '',
  NationalID: '',
  Email: '',
  PhoneNumber: '',
  city_id: null,
  ApplicationSource: 'Manual', // 👈 لاحظ: التقديم الداخلي يأخذ Manual افتراضياً
})

// دالة لتعبئة النموذج إذا كان هناك بيانات (Edit Mode)
const populateForm = () => {
  if (props.applicantData && props.applicantData.id) {
    form.id = props.applicantData.id
    form.FirstName = props.applicantData.FirstName || ''
    form.LastName = props.applicantData.LastName || ''
    form.NationalID = props.applicantData.NationalID || ''
    form.Email = props.applicantData.Email || ''
    form.PhoneNumber = props.applicantData.PhoneNumber || ''
    form.city_id = props.applicantData.city_id || null
    form.ApplicationSource = props.applicantData.ApplicationSource || 'Manual'
  }
}

// تشغيل التعبئة عند فتح المكون أو تغير البيانات القادمة من الأب
onMounted(populateForm)
watch(() => props.applicantData, populateForm, { deep: true })

const saveData = async () => {
  try {
    const payload = { ...form, city_id: form.city_id ? Number(form.city_id) : null }
    let savedData = null

    if (form.id) {
      // هنا تفترض أن لديك دالة تحديث في الستور (سنراجعها لاحقاً)
      savedData = await applicantStore.updateApplicant(form.id, payload)
      alert('تم تحديث البيانات بنجاح')
    } else {
      // دالة الإنشاء التي استخدمناها سابقاً في الخارجي
      savedData = await applicantStore.createApplicant(payload)
      alert('تم حفظ المتقدم الجديد بنجاح')
    }

    // إبلاغ الشاشة الأب (ApplicantProfile) بنجاح الحفظ لتفعيل تبويبات المرفقات والخبرات
    emit('saved', savedData || { id: form.id })
  } catch (error) {
    console.error('خطأ في حفظ البيانات الأساسية:', error)
  }
}

watch(
  () => props.applicantData,
  (newData) => {
    if (newData) {
      // ✅ هذه الدالة ستقوم بتعبئة الـ form بمجرد وصول البيانات من الأب
      populateForm()
    }
  },
  { immediate: true, deep: true },
)
</script>
