<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div
      class="bg-surface-ground border border-surface-border p-4 rounded-xl mb-6 flex items-center gap-6"
    >
      <div class="relative shrink-0">
        <div
          class="h-24 w-24 rounded-full border-2 border-primary/20 bg-white overflow-hidden flex items-center justify-center"
        >
          <img
            v-if="imagePreview"
            :src="imagePreview"
            class="h-full w-full object-cover"
            alt="صورة المترشح"
          />
          <svg
            v-else
            class="h-10 w-10 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>
      <div class="flex-1">
        <label class="text-sm font-bold text-text-primary block mb-2"
          >الصورة الشخصية (اختياري)</label
        >
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          @change="handleImageChange"
          class="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInput
        v-model="form.Name"
        id="name"
        label="اسم المترشح (رباعي)"
        placeholder="أدخل الاسم كامل..."
        required
      />

      <!-- <div class="flex flex-col">
        <label class="text-sm font-bold text-text-primary mb-1">الدورة التدريبية (اختياري)</label>
        <select
          v-model="form.job_request_id"
          class="w-full rounded-lg border-surface-border bg-surface-section text-text-primary focus:ring-primary h-[42px] px-3 border"
        >
          <option :value="null">--- لا يتبع لدورة محددة ---</option>
          <option v-for="job in jobRequests" :key="job.id" :value="job.id">
            {{ job.RequiredMajor }} - {{ job.RequestNo }}
          </option>
        </select>
      </div> -->

      <div class="flex flex-col">
        <label class="text-sm font-bold text-text-primary mb-1">نوع التدريب</label>
        <select
          v-model="form.TrainingType"
          class="w-full rounded-lg border-surface-border bg-surface-section text-text-primary focus:ring-primary h-[42px] px-3 border"
        >
          <option value="internal">تدريب داخلي</option>
          <option value="external">تدريب خارجي</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInput
        v-model="form.NationalNo"
        id="national_no"
        type="text"
        inputmode="numeric"
        label="الرقم الوطني"
        placeholder="أدخل الرقم الوطني..."
      />

      <div class="relative">
        <AppInput v-model="form.BirthDate" id="birth_date" type="date" label="تاريخ الميلاد" />
        <span
          v-if="currentAge !== null"
          class="absolute top-0 left-0 text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded"
        >
          العمر: {{ currentAge }} سنة
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInput
        v-model="form.Phone"
        id="phone"
        type="text"
        label="رقم الهاتف"
        placeholder="09..."
      />
      <AppInput v-model="form.Residence" id="residence" label="السكن" placeholder="مثال: بنغازي" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInput
        v-model="form.PassportNo"
        id="passport_no"
        label="رقم الجواز"
        placeholder="مثال: AB123456"
      />
      <AppInput
        v-model="form.PassportExpiry"
        id="passport_expiry"
        type="date"
        label="صلاحية الجواز (تاريخ الانتهاء)"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInput
        v-model="form.Qualification"
        id="qualification"
        label="المؤهل العلمي"
        placeholder="مثال: بكالوريوس هندسة"
      />
      <AppInput v-model="form.Size" id="size" label="المقاس (الزي)" placeholder="مثال: XL, 42" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInput
        v-model="form.BankName"
        id="bank_name"
        label="اسم المصرف"
        placeholder="مثال: مصرف الوحدة"
      />
      <AppInput
        v-model="form.BankAccountNo"
        id="bank_account_no"
        label="رقم الحساب"
        placeholder="أدخل رقم الحساب الجاري..."
      />
    </div>

    <div class="flex items-center gap-2">
      <input
        v-model="form.IsFit"
        type="checkbox"
        id="is_fit"
        class="h-5 w-5 rounded border-surface-border text-primary focus:ring-primary cursor-pointer"
      />
      <label
        for="is_fit"
        class="text-sm font-bold cursor-pointer select-none"
        :class="form.IsFit ? 'text-success' : 'text-danger'"
      >
        حالة المترشح: {{ form.IsFit ? 'لائق طبياً' : 'غير لائق' }}
      </label>
    </div>

    <AppTextarea
      v-model="form.Notes"
      id="notes"
      label="ملاحظات"
      placeholder="أي ملاحظات إضافية..."
      rows="3"
    />

    <div class="flex justify-end gap-3 mt-8 pt-5 border-t border-surface-border">
      <AppButton type="button" variant="secondary" @click="$emit('cancel')" :disabled="loading"
        >إلغاء</AppButton
      >
      <AppButton
        type="submit"
        variant="primary"
        :loading="loading"
        :disabled="loading"
        class="px-8"
      >
        {{ isEditing ? 'حفظ التعديلات' : 'تسجيل المترشح' }}
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useJobRequestStore } from '@/stores/jobRequestStore' // استيراد ستور الطلبات
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

// 1. تعريف الـ Stores
const jobRequestStore = useJobRequestStore()

// 2. تعريف الحالة (State)
const form = ref({
  job_request_id: null, // الحقل الجديد
  TrainingType: 'internal',
  Name: '',
  BirthDate: '',
  Qualification: '',
  PassportNo: '',
  PassportExpiry: '',
  NationalNo: '',
  Phone: '',
  Residence: '',
  Size: '',
  IsFit: true,
  Notes: '',
  BankName: '', // 👈 أضف هذا
  BankAccountNo: '', // 👈 أضف هذا
  image: null,
})

const imagePreview = ref(null)
const fileInput = ref(null)

// جلب قائمة الدورات من الستور لعرضها في القائمة المنسدلة
const jobRequests = computed(() => jobRequestStore.items)

const isEditing = computed(() => !!props.initialData)

// حساب العمر الحالي بناءً على تاريخ الميلاد
const currentAge = computed(() => {
  if (!form.value.BirthDate) return null

  const birth = new Date(form.value.BirthDate)
  const today = new Date()

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  // طرح سنة إذا لم يأتِ يوم ميلاده بعد في السنة الحالية
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
})

// 3. الدوال المساعدة
const resetForm = () => {
  form.value = {
    job_request_id: null,
    TrainingType: 'internal',
    Name: '',
    BirthDate: '',
    Qualification: '',
    PassportNo: '',
    PassportExpiry: '',
    NationalNo: '',
    Phone: '',
    Residence: '',
    Size: '',
    IsFit: true,
    Notes: '',
    BankName: '',
    BankAccountNo: '',
    image: null,
  }
  imagePreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.image = file
    imagePreview.value = URL.createObjectURL(file)
  } else {
    form.value.image = null
    imagePreview.value = props.initialData?.image_url || null
  }
}

const handleSubmit = () => {
  const formData = new FormData()

  // إضافة الحقول الأساسية للـ FormData
  formData.append('Name', form.value.Name)
  formData.append('TrainingType', form.value.TrainingType)
  formData.append('NationalNo', form.value.NationalNo || '')
  formData.append('Phone', form.value.Phone || '')
  formData.append('Residence', form.value.Residence || '')
  formData.append('Size', form.value.Size || '')
  formData.append('Qualification', form.value.Qualification || '')
  formData.append('Notes', form.value.Notes || '')
  formData.append('IsFit', form.value.IsFit ? '1' : '0')
  formData.append('BankName', form.value.BankName || '')
  formData.append('BankAccountNo', form.value.BankAccountNo || '')
  // إضافة الحقول الجديدة والاختيارية
  if (form.value.job_request_id) formData.append('job_request_id', form.value.job_request_id)
  if (form.value.BirthDate) formData.append('BirthDate', form.value.BirthDate)
  if (form.value.PassportNo) formData.append('PassportNo', form.value.PassportNo)
  if (form.value.PassportExpiry) formData.append('PassportExpiry', form.value.PassportExpiry)

  if (form.value.image instanceof File) {
    formData.append('image', form.value.image)
  }

  emit('submit', formData)
}

// 4. مراقبة البيانات المبدئية عند التعديل
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        job_request_id: newData.job_request_id || null, // تعبئة رقم الدورة عند التعديل
        TrainingType: newData.TrainingType || 'internal',
        Name: newData.Name || '',
        BirthDate: newData.BirthDate || '',
        Qualification: newData.Qualification || '',
        PassportNo: newData.PassportNo || '',
        PassportExpiry: newData.PassportExpiry || '',
        NationalNo: newData.NationalNo || '',
        Phone: newData.Phone || '',
        Residence: newData.Residence || '',
        Size: newData.Size || '',
        IsFit: newData.IsFit ?? true,
        Notes: newData.Notes || '',
        BankName: newData.BankName || '', // 👈 جلب البيانات عند التعديل
        BankAccountNo: newData.BankAccountNo || '', // 👈 جلب البيانات عند التعديل
        image: null,
      }
      imagePreview.value = newData.image_url || null
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

// 5. جلب الدورات التدريبية عند فتح الشاشة
onMounted(async () => {
  if (jobRequestStore.items.length === 0) {
    await jobRequestStore.fetchJobRequests()
  }
})
</script>
