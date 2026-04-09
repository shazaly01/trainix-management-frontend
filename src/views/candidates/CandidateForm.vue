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
          accept="image/jpeg, image/png, image/jpg"
          @change="handleImageChange"
          class="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
        />
        <p class="text-xs text-text-muted mt-1">يُسمح بصيغ JPG, PNG بحجم أقصى 5 ميجابايت.</p>
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

      <AppInput
        v-model="form.NationalNo"
        id="national_no"
        type="text"
        inputmode="numeric"
        label="الرقم الوطني"
        placeholder="أدخل الرقم الوطني..."
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInput v-model="form.BirthDate" id="birth_date" type="date" label="تاريخ الميلاد" />

      <AppInput
        v-model="form.Phone"
        id="phone"
        type="text"
        label="رقم الهاتف"
        placeholder="09..."
      />
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
        placeholder="مثال: بكالوريوس هندسة نفطية"
      />

      <AppInput v-model="form.Residence" id="residence" label="السكن" placeholder="مثال: بنغازي" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
      <AppInput
        v-model="form.Size"
        id="size"
        label="المقاس (الزي)"
        placeholder="مثال: XL, 2XL, -42"
      />

      <div class="flex items-center gap-2 mb-2">
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
    </div>

    <AppTextarea
      v-model="form.Notes"
      id="notes"
      label="ملاحظات"
      placeholder="أي ملاحظات إضافية حول المترشح..."
      rows="3"
    />

    <div class="flex justify-end gap-3 mt-8 pt-5 border-t border-surface-border">
      <AppButton type="button" variant="secondary" @click="$emit('cancel')" :disabled="loading">
        إلغاء
      </AppButton>

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
import { ref, watch, computed } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

// 1. تعريف الحالة (State)
const form = ref({
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
  image: null, // سيحمل ملف الصورة
})

const imagePreview = ref(null) // لحفظ رابط معاينة الصورة
const fileInput = ref(null)

const isEditing = computed(() => !!props.initialData)

// 2. الدوال المساعدة
const resetForm = () => {
  form.value = {
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
    image: null,
  }
  imagePreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}

// دالة لمعالجة اختيار الصورة وإنشاء رابط معاينة محلي لها
const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.image = file
    imagePreview.value = URL.createObjectURL(file)
  } else {
    form.value.image = null
    imagePreview.value = props.initialData?.Image?.FileUrl || null
  }
}

// دالة الإرسال وتجهيز الـ FormData
const handleSubmit = () => {
  // 1. إنشاء كائن FormData (هذا ما سيغير Content-Type تلقائياً)
  const formData = new FormData()

  // 2. إضافة الحقول الأساسية
  formData.append('Name', form.value.Name)
  formData.append('NationalNo', form.value.NationalNo || '')
  formData.append('Phone', form.value.Phone || '')
  formData.append('Residence', form.value.Residence || '')
  formData.append('Size', form.value.Size || '')
  formData.append('Qualification', form.value.Qualification || '')
  formData.append('Notes', form.value.Notes || '')

  // تحويل البوليان لرقم (إلزامي للـ FormData)
  formData.append('IsFit', form.value.IsFit ? '1' : '0')

  if (form.value.BirthDate) formData.append('BirthDate', form.value.BirthDate)
  if (form.value.PassportNo) formData.append('PassportNo', form.value.PassportNo)
  if (form.value.PassportExpiry) formData.append('PassportExpiry', form.value.PassportExpiry)

  // 3. الجزء الحاسم: إضافة الصورة كملف حقيقي
  // تأكد أن form.value.image هو كائن File وليس مصفوفة أو نص
  if (form.value.image instanceof File) {
    formData.append('image', form.value.image)
  }

  // 4. إرسال الـ FormData بالكامل
  emit('submit', formData)
}

// 3. مراقبة البيانات المبدئية (للتعديل)
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
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
        image: null, // نبقيه فارغاً ما لم يرفع صورة جديدة
      }
      // جلب رابط الصورة إذا كان المترشح يملك صورة مسبقاً
      imagePreview.value = newData.Image?.FileUrl || null
    } else {
      resetForm()
    }
  },
  { immediate: true },
)
</script>
